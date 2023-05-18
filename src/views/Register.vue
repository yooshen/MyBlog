<template>
  <div class="form-wrap">
    <form class="register">
      <p class="login-register">
        Already have an account?
        <router-link class="router-link" :to="{ name: 'Login' }"
          >Login</router-link
        >
      </p>
      <h2>Create Your FireBlogs Account</h2>
      <div class="inputs">
        <div class="input">
          <input type="text" placeholder="First Name" v-model="firstname" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Last Name" v-model="lastname" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Username" v-model="username" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Email" v-model="email" />
          <email class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Password" v-model="password" />
          <password class="icon" />
        </div>
        <div v-show="error" class="error">
          {{ this.errorMsg }}
        </div>
      </div>
      <button @click.prevent="register">Sign Up</button>
      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</template>

<script>
import email from "../assets/Icons/envelope-regular.svg";
import password from "../assets/Icons/lock-alt-solid.svg";
import user from "../assets/Icons/user-alt-light.svg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseInit";

import { getFirestore, doc, setDoc } from "firebase/firestore";

export default {
  name: "Resgister",
  components: { email, password, user },

  data() {
    return {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      error: null,
      errorMsg: "",
    };
  },

  methods: {
    async register() {
      if (
        this.email !== "" &&
        this.password !== "" &&
        this.firstname !== "" &&
        this.lastname !== "" &&
        this.username !== ""
      ) {
        this.error = false;
        this.errorMsg = "";

        const createUser = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        const result = createUser;
        // console.log(result);
        const db = getFirestore();
        try {
          await setDoc(doc(db, "users", (result.user.uid)), {
            firstName: this.firstname,
            lastName: this.lastname,
            userName: this.username,
            email: this.email
          });
        } catch (err) {
          console.error("Error: ", err);
        }
        // const docRef = await setDoc(doc(db, "users",(result.user.uid)), {
        //     firstName: this.firstName,
        //     lastName: this.lastName,
        //     userName: this.username,
        //     email: this.emali
        // });
        // console.log(docRef);
        // await dataBase.set({
        // firstName: this.firstName,
        // lastName: this.lastName,
        // userName: this.username,
        // email: this.emali
        // });
        this.$router.push({ name: "Home" });
        return;
      }
      this.error = true;
      this.errorMsg = "Please fill out all the fields";
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.register {
  h2 {
    max-width: 350px;
  }
}
</style>
