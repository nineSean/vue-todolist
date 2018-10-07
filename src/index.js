import Vue from 'vue'
import AV from 'leancloud-storage'
import './login.scss'
import './todolist.scss'

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
    this.currentUser = this.getCurrentUser()
    this.getTodos()
  },
  // watch: {
  //   todoList: function(){
  //     this.saveOrUpdateTodos()
  //   }
  // }, // 当done变化时，不生效，改在checkbox上bind change event
  methods: {
    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password).then(loginedUser => {
        this.currentUser = this.getCurrentUser()
        this.getTodos()
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
    getTodos: function(){
      if(!AV.User.current()) return
      var query = new AV.Query('AllTodos');
      query.find().then((todos) => {
        let avAllTodos = todos[0]
        this.todoList = JSON.parse(avAllTodos.attributes.content)
        this.todoList.id = avAllTodos.id
      }, function (error) {
        console.log(error)
      })
    },
    saveTodos: function(){
      let dataString = JSON.stringify(this.todoList)
      let AVTodos = AV.Object.extend('AllTodos')
      let avTodos = new AVTodos()
      let acl = new AV.ACL()
      acl.setReadAccess(AV.User.current(), true)
      acl.setWriteAccess(AV.User.current(), true)
      avTodos.set('content', dataString)
      avTodos.setACL(acl)
      avTodos.save().then(todo => {
        this.todoList.id = todo.id
        console.log('保存成功')
      }, error => {
        console.log(error)
      })
    },
    updateTodos: function(){
      let todos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
      todos.set('content', JSON.stringify(this.todoList))
      todos.save().then(() => {
        console.log('更新成功')
      })
    },
    saveOrUpdateTodos: function(){
      this.todoList.id ? this.updateTodos() : this.saveTodos()
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
      this.saveOrUpdateTodos()
    },
    removeTodo: function (todo) {
      let index = this
        .todoList
        .indexOf(todo)
      this
        .todoList
        .splice(index, 1)
      this.saveOrUpdateTodos()
    }
  }
})
