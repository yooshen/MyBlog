<template>
  <div class="create-post">
    <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview" />
    <Loading v-show="loading" />
    <div class="container">
      <div :class="{ invisible: !error }" class="err-message">
        <p><span>Error:</span>{{ this.errorMsg }}</p>
      </div>
      <div class="blog-info">
        <input type="text" placeholder="Enter Blog Title" v-model="blogTitle" />
        <div class="upload-file">
          <label for="blog-photo">Upload Cover Photo</label>
          <input
            type="file"
            ref="blogPhoto"
            id="blog-photo"
            @change="fileChange"
            accept=".png, .jpg, .jpeg"
          />
          <button
            @click="openPreview"
            class="preview"
            :class="{ 'button-inactive': !this.$store.state.blogPhotoFileURL }"
          >
            Preview Photo
          </button>
          <span>File Chosen: {{ this.$store.state.blogPhotoName }}</span>
        </div>
      </div>
      <div class="editor">
        <vue-editor
          :editorOptions="editorSettings"
          v-model="blogHTML"
          useCustomImageHandler
          @image-added="imageHadler"
        ></vue-editor>
      </div>
      <div class="blog-actions">
        <button @click="updateBlog">Save Changes</button>
        <router-link class="router-button" :to="{ name: 'BlogPreview' }"
          >Preview Changes</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import Quill from "quill";
import BlogCoverPreview from "../components/BlogCoverPreview.vue";
import Loading from "../components/Loading.vue";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  getFirestore,
  doc,
  updateDoc,
} from "firebase/firestore";
window.Quill = Quill;
const ImageResize = require("quill-image-resize-module").default;
Quill.register("modules/imageResize", ImageResize);
export default {
  name: "CreatePost",
  components: { BlogCoverPreview, Loading },
  data() {
    return {
      file: null,
      error: null,
      errorMsg: null,
      loading: null,
      routeID: null,
      currentBlog: null,
      editorSettings: {
        modules: {
          imageResize: {},
        },
      },
    };
  },

  computed: {
    profileId() {
      return this.$store.state.profileId;
    },
    blogCoverPhotoName() {
      return this.$store.state.blogPhotoName;
    },
    blogTitle: {
      get() {
        return this.$store.state.blogTitle;
      },
      set(payload) {
        this.$store.commit("updateBlogTitle", payload);
      },
    },
    blogHTML: {
      get() {
        return this.$store.state.blogHTML;
      },
      set(payload) {
        this.$store.commit("newBlogPost", payload);
      },
    },
  },

  mounted() {
    this.routeID = this.$route.params.blogid;
    this.currentBlog = this.$store.state.blogPosts.filter((post) => {
      return post.blogId === this.routeID;
    });
    this.$store.commit("setBlogState", this.currentBlog[0]);
  },

  methods: {
    fileChange() {
      this.file = this.$refs.blogPhoto.files[0];

      // this.$refs.blogPhoto指向 這個input
      // <input
      //     type="file"
      //     ref="blogPhoto"
      //     id="blog-photo"
      //     @change="fileChange"
      //     accept=".png, .jpg, .jpeg"
      //   />
      //File API 可以從 File 物件中讀取 FileList ，FileList 內包含使用者所選取的檔案。

      //如果使用者只選擇一個檔案，那麼我們只需要考慮第一個檔案物件。

      //使用 DOM 獲取選擇的檔案：
      //   var selectedFile = document.getElementById('input').files[0];

      const fileName = this.file.name;

      this.$store.commit("fileNameChange", fileName);
      this.$store.commit("createFileURL", URL.createObjectURL(this.file));
    },
    openPreview() {
      this.$store.commit("openPhotoPreview");
    },

    imageHadler(file, Editor, cursorLocation, resetUploader) {
      const storage = getStorage();
      const docRef = ref(storage, `documents/blogPostPhotos/${file.name}`);
      console.log(docRef);

      const uploadTask = uploadBytesResumable(docRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (err) => {
          console.log(err);
        },
        async () => {
          const downloadURL = await getDownloadURL(docRef);
          Editor.insertEmbed(cursorLocation, "image", downloadURL);
          resetUploader();
        }
      );
    },
    async updateBlog() {
      const db = getFirestore();
      const dataBase = doc(db, "blogPosts", this.routeID);
      if (this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
        if (this.file) {
          this.loading = true;
          const storage = getStorage();
          const docRef = ref(
            storage,
            `documents/blogPostPhotos/${this.$store.state.blogPhotoName}`
          );
          const uploadTask = uploadBytesResumable(docRef, this.file);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              console.log(snapshot);
            },
            (err) => {
              console.log(err);
              this.loading = false;
            },
            async () => {
              const downloadURL = await getDownloadURL(docRef);
                this.loading = true;
              try {

                await updateDoc(dataBase, {
                  blogHTML: this.blogHTML,
                  blogCoverPhoto: downloadURL,
                  blogCoverPhotoName: this.blogCoverPhotoName,
                  blogTitle: this.blogTitle,
                });

                await this.$store.dispatch("updatePost",this.routeID);
                this.loading = false;
                this.$router.push({
                  name: "ViewBlog",
                  params: { blogid: dataBase.id },
                });
              } catch (err) {
                console.error("Error: ", err);
              }
            }
          );
          return;
        }
        this.loading = true;
        try {
          await updateDoc(dataBase, {
            blogTitle: this.blogTitle,
            blogHTML: this.blogHTML,
          });
        } catch (err) {
          console.error("Error: ", err);
        }
        await this.$store.dispatch("updatePost", this.routeID);
        this.loading = false;
        this.$router.push({
          name: "ViewBlog",
          params: { blogid: dataBase.id },
        });

        // this.error = true;
        // this.errorMsg = "Please ensure you uploaded a cover photo!";
        // setTimeout(() => {
        //   this.error = false;
        // }, 2000);
        // return;
      }
      this.error = true;
      this.errorMsg = "Please ensure Blog Title & Blog Post has been filled!";
      setTimeout(() => {
        this.error = false;
      }, 2000);
    },
  },
};
</script>

<style lang="scss">
.create-post {
  position: relative;
  height: 100%;

  button {
    margin-top: 0;
  }

  .router-button {
    text-decoration: none;
    color: #fff;
  }

  label,
  button,
  .router-button {
    transition: 0.5s ease-in-out all;
    align-self: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 20px;
    padding: 12px 24px;
    color: #fff;
    background-color: #303030;
    text-decoration: none;

    &:hover {
      background-color: rgba(48, 48, 48, 0.7);
    }
  }

  .container {
    position: relative;
    height: 100%;
    padding: 10px 25px 60px;
  }

  // error styleing
  .invisible {
    opacity: 0 !important;
  }

  .err-message {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 18px;
    background-color: #303030;
    opacity: 1;
    transition: 0.5s ease all;

    p {
      font-size: 14px;
    }

    span {
      font-weight: 600;
    }
  }

  .blog-info {
    display: flex;
    margin-bottom: 32px;

    input:nth-child(1) {
      min-width: 300px;
    }

    input {
      transition: 0.5s ease-in-out all;
      padding: 10px 4px;
      border: none;
      border-bottom: 1px solid #303030;

      &:focus {
        outline: none;
        box-shadow: 0 1px 0 0 #303030;
      }
    }
    .upload-file {
      flex: 1;
      margin-left: 16px;
      position: relative;
      display: flex;

      input {
        display: none;
      }

      .preview {
        margin-left: 16px;
        text-transform: initial;
      }

      span {
        font-size: 12px;
        margin-left: 16px;
        align-self: center;
      }
    }
  }

  .editor {
    height: 60vh;
    display: flex;
    flex-direction: column;

    .quillWrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .ql-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: scroll;
    }

    .ql-editor {
      padding: 20px 16px 30px;
    }
  }

  .blog-actions {
    margin-top: 32px;

    button {
      margin-right: 16px;
    }
  }
}
</style>
