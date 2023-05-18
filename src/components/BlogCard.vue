<template>
        <transition name="fade">
            <div class="blog-card" ref="card">
                <div v-show="editPost" class="icons">
                    <div @click="editBlog" class="icon">
                        <Edit class="edit"/>
                    </div>
                    <div @click="deletePost" class="icon">
                        <Delete class="delete"/>
                    </div>
                </div>
                <img :src="post.blogCoverPhoto" alt=""/>
                <div class="info">
                    <h4>{{ post.blogTitle }}</h4>
                    <h6>Posted on: {{ new Date(post.blogDate).toLocaleDateString('en-us',{ dateStyle: "long"}) }}</h6>
                    <router-link class="link" :to="{ name: 'ViewBlog', params: {blogid: this.post.blogId}}">
                        View the post <Arrow class="arrow"/>
                    </router-link>
        
                </div>
                
            </div>
        </transition>
</template>

<script>
import Arrow from "../assets/Icons/arrow-right-light.svg"
import Edit from "../assets/Icons/edit-regular.svg"
import Delete from "../assets/Icons/trash-regular.svg"
export default {
    props:['post'],
    components:{ Arrow,Edit,Delete },

    data() {
        return {
            
        };
    },

    computed:{
        editPost(){
            return this.$store.state.editPost
        },
        
    },
     

    mounted() {

    },


    methods: {
       deletePost(){
        this.$store.dispatch("deletePost", this.post.blogId)
       },
       editBlog(){
        this.$router.push({ name:"EditBlog",params: {blogid: this.post.blogId}});
       }
    },
};
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 5s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
}

    .blog-card{
        position: relative;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        max-height: 420px;
        background-color: #fff;
        // transition: .5s ease all;

        // &:hover{
        //     transform: rotateZ(-1deg) scale(1.01);
        //     box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0,0,0,0.06)
        // }

        .icons{
            display: flex;
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 99;

            .icon{
                display: flex;
                width: 35px;
                height: 35px;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                background-color: #fff;
                transition: .5s ease all;
                
                &:hover{
                    background-color: #303030;

                    .edit,
                    .delete{
                        path{
                            fill: #fff;
                        }
                    }
                }

                &:nth-child(1){
                    margin-right: 8px;
                }

                .edit,
                .delete{
                    pointer-events: none;
                    height: 15px;
                    width: auto;
                }
            }
        }

        img{
            display: block;
            border-radius: 8px 8px 0 0;
            min-height: 200px;
            width: 100%;
            object-fit: cover;
            z-index: 1;
        }

        .info{
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 32px 16px;
            color:#000;

            h4{
                padding-bottom: 8px;
                font-weight: 300;
                font-size: 20px;
            }

            h6{
                padding-bottom: 16px;
                font-weight: 400;
                font-size: 12px;
            }

            .link{
                display: inline-flex;
                align-items: center;
                margin-top: auto;
                font-weight: 500;
                padding-top: 20px;
                font-size: 12px;
                padding-bottom: 4px;
                transition: 0.5s ease-in all;

                &:hover{
                    color: rgba(48,48,48,0.8);
                }

                .arrow{
                    width: 10px;
                }
            }

            
        }
    }
</style>