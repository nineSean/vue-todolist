import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = 'mYh0wItrTJIa21cOI97cqHdN-gzGzoHsz';
var APP_KEY = 'RvNjHyG3CLokYoLDRoXWvF3o';
AV.init({appId: APP_ID, appKey: APP_KEY})

let app = new Vue({
  el: '#app',
  data: {
    actionType: 'login',
    formData: {
      username: '',
      password: ''
    },
    currentUser: null,
    index: 0,
    newTodo: '',
    todoList: []
  },
  created: function () {
    window.onbeforeunload = () => {
      this.setStorage('newTodo')
      this.setStorage('todoList')
      this.setStorage('index')
    }
    this.index = this.getStorage('index') || 0
    this.newTodo = this.getStorage('newTodo') || ''
    this.todoList = this.getStorage('todoList') || []
    this.currentUser = this.getCurrentUser()
  },
  methods: {
    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password).then(loginedUser => {
        this.currentUser = this.getCurrentUser()
      }, function (error) {
        console.log(error)
      });
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user
        .signUp()
        .then(loginedUser => {
          this.login()
        }, (function (error) {
          console.log(error)
        }));
    },
    logout: function(){
      AV.User.logOut()
      this.currentUser = null
      window.location.reload()
    },
    getCurrentUser: function(){
      let current = AV.User.current()
      if(current){
        let {id, attributes: {username}, createdAt} = current
        return {id, username, createdAt}
      }else{
        return null
      }
    },
    addTodo: function () {
      this.newTodo === ''
        ? console.log('please type something')
        : this
          .todoList
          .push({
            key: this.index++,
            done: false,
            createdAt: new Date().toLocaleDateString(),
            content: this.newTodo
          })
      this.newTodo = ''
    },
    removeTodo: function (todo) {
      let index = this
        .todoList
        .indexOf(todo)
      this
        .todoList
        .splice(index, 1)
    },
    setStorage: function (name) {
      window
        .localStorage
        .setItem(name, JSON.stringify(this[name]))
    },
    getStorage: function (name) {
      return JSON.parse(window.localStorage.getItem(name))
    }
  }
})
