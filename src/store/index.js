import Vue from 'vue'
import Vuex from 'vuex'
import { getDoc,getDocs,doc, updateDoc,collection,deleteDoc} from "firebase/firestore"; 
import { auth } from "../firebase/firebaseInit";
import { db } from "../firebase/firebaseInit" ;
import { query, orderBy } from "firebase/firestore";  



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sampleBlogCards:[
        { blogTitle:"Blog Card #1", blogCoverPhoto:"stock-1", blogDate:"May 1, 2021"},
        { blogTitle:"Blog Card #2", blogCoverPhoto:"stock-2", blogDate:"May 1, 2021"},
        { blogTitle:"Blog Card #3", blogCoverPhoto:"stock-3", blogDate:"May 1, 2021"},
        { blogTitle:"Blog Card #4", blogCoverPhoto:"stock-4", blogDate:"May 1, 2021"}
    ],
    blogPosts:[],
    postLoaded:null,
    blogHTML:"Write your blog title here...",
    blogTitle:"",
    blogPhotoName:"",
    blogPhotoFileURL:"",
    blogPhotoPreview:null,
    editPost: null,
    user:null,
    profileAdmin:null,
    profileEmail:null,
    profileFirstName:null,
    profileLastName:null,
    profileUsername:null,
    profileId:null,
    profileInitials:null,

  },
  mutations: {

    newBlogPost(state,payload){
        state.blogHTML = payload
    },
    updateBlogTitle(state,payload){
        state.blogTitle = payload
    },
    fileNameChange(state,payload){
        state.blogPhotoName = payload
    },
    createFileURL(state,payload){
        state.blogPhotoFileURL = payload
    },
    openPhotoPreview(state){
        state.blogPhotoPreview = !state.blogPhotoPreview
    },
    toggleEditPost(state,payload){
        state.editPost = payload
    },
    setBlogState(state,payload){
        state.blogTitle = payload.blogTitle;
        state.blogHTML = payload.blogHTML;
        state.blogPhotoFileURL = payload.blogCoverPhoto;
        state.blogPhotoName = payload.blogCoverPhotoName;
    },
    filterBlogPost(state,payload){
        state.blogPosts = state.blogPosts.filter((post) => post.blogId !== payload );
    },
    updateUser(state,payload){
        state.user = payload
    },
    setProfileAdmin(state,payload){
        state.profileAdmin = payload;
        console.log(state.profileAdmin);
    },
    setProfileInfo(state,doc){
        state.profileId = doc.id
        state.profileEmail = doc.data().email
        state.profileFirstName = doc.data().firstName
        state.profileLastName = doc.data().lastName
        state.profileUsername = doc.data().userName

    },
    setProfileInitials(state){
        state.profileInitials = state.profileFirstName.match(/(\b\S)?/g).join("")+
        state.profileLastName.match(/(\b\S)?/g).join("")
    },
    changeFirstName(state,payload){
        state.profileFirstName = payload
    },
    changeLastName(state,payload){
        state.profileLastName = payload
    },
    changeUserName(state,payload){
        state.profileUsername = payload
    }
  },
  getters: {
    blogPostsFeed(state){
        return state.blogPosts.slice(0,2);
    },
    blogPostsCards(state){
        return state.blogPosts.slice(2,6)
    }
  },
  actions: {
    async getCurrentUser({ commit },user){
        // const db = getFirestore();
        const dataBase =   doc(db, "users",(auth.currentUser.uid) );
        const dbResults = await getDoc(dataBase);
       
        commit('setProfileInfo',dbResults);
        commit('setProfileInitials');
        console.log(dbResults.data());
        const token = await user.getIdTokenResult();
        const admin = await token.claims.admin;
        commit('setProfileAdmin',admin)
    },

    async getPost({ state }){
        const dataBase = collection(db,"blogPosts")
        const q =  query(dataBase, orderBy('date','desc'));
        let dbResults = await getDocs(q);
        dbResults.forEach((doc) => {
            if(!state.blogPosts.some((post)=> post.blogId === doc.id)){
                
                const data = {
                    blogId: doc.data().blogId,
                    blogHTML: doc.data().blogHTML,
                    blogCoverPhoto: doc.data().blogCoverPhoto,
                    blogTitle: doc.data().blogTitle,
                    blogDate: doc.data().date,
                    blogCoverPhotoName : doc.data().blogCoverPhotoName
                };
                state.blogPosts.push(data)

               
            }
            //  這個條件檢查當前文件的 id（使用 doc.id 取得）是否不存在於 state 物件中的 blogPosts 陣列中。
            // 如果文件的 id 在 blogPosts 陣列中找不到，以下的程式碼區塊會被執行。
            
        });
        state.postLoaded = true
        console.log(state.blogPosts);

    }, 

    async updatePost( {commit,dispatch},payload){
        commit("filterBlogPost",payload);
        await dispatch("getPost")        
    },

    async deletePost({ commit },payload){
        const getPost = doc(db,"blogPosts",payload);
        await deleteDoc(getPost);
        commit("filterBlogPost",payload);

    },

    async updateUserSettings({ state,commit }){
        const dataBase = doc(db, "users",(state.profileId) );
        await updateDoc(dataBase,{
            firstName: state.profileFirstName,
            lastName:state.profileLastName,
            username:state.profileUsername
        });
        commit('setProfileInitials')
    }
  },
  modules: {
  }
})
