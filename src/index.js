import Vue from 'vue'
// Vue.config.devtools = true


let app = new Vue({
  el: '#app',
  data: {
    index: 0,
    newTodo: '',
    todoList: []
  },
  created: function(){
    console.log(this['index'], this.index)
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
    removeTodo: function(todo){
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
    },
    setStorage: function(name){
      window.localStorage.setItem(name, JSON.stringify(this[name]))
    },
    getStorage: function(name){
      return JSON.parse(window.localStorage.getItem(name))
    }
  },
})

