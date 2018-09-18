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
    isLogined: false,
    account: '',
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
  },
  methods: {
    login: function () {
      let app = this
      AV.User.logIn(this.formData.username, this.formData.password).then(function (loginedUser) {
        console.log(loginedUser)

        app.isLogined = true
        app.account = loginedUser.attributes.username
      }, function (error) {
        console.log(error)
      });
    },
    signUp: function () {
      let app = this
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user
        .signUp()
        .then(function (loginedUser) {
          app.login()
        }, (function (error) {
          console.log(error)
        }));
    },
    logout: function(){
      AV.User.logOut()
      this.isLogined = false
      app.initInfo()
    },
    initInfo: function () {
      this.formData.username = ''
      this.formData.password = ''
      this.actionType = 'login'
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
