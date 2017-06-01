import React, { Component } from 'react';
var $ = window.jQuery = require('jquery');
window.Vel = require('materialize-css/js/velocity.min')
import base from '../rebase';
import moment from 'moment';
var firebase = require('firebase');

window.base = base;

class Board extends Component {


  constructor() {
    super()
    this.state = {
      post: '',
      posts: []
    }
  }

componentDidMount() {

  firebase.database().ref(`neighborhoods/${this.props.id}/posts`).on('value', (snapshot) =>{

    const currentPosts = snapshot.val()

    if (currentPosts != null){
      this.setState({
        posts: currentPosts
      })
    }
  })
}

updatePost(event) {
  this.setState({
    post: event.target.value
  })
}

submitPost(event) {
  const nextPost = {
    id: this.state.posts.length,
    text: this.state.post,
    username: this.props.currentUser.displayName,
    pic: this.props.currentUser.photoURL,
    key: this.props.currentUser.uid,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  $('#message').val('');
  event.preventDefault()

  firebase.database().ref(`neighborhoods/${this.props.id}/posts/${nextPost.id}`).set(nextPost)

}



deleteButton(post) {
  if (post.key === this.props.currentUser.uid) {
    return (
      <i className="material-icons right delete-button" onClick={this.deletePost.bind(this, post)}>delete</i>
    )
  }
}

deletePost(post) {
  base.remove(`neighborhoods/${this.props.id}/posts/${post.id}`)
}


  render() {
    const currentPost = this.state.posts.map((post, i) => {
      return (
        <div className='messages'>
          <li key={post.id}>
            <img
            width='65'
            className='left repsonsive-img chat-avatar'
            alt='avatar'
            src={post.pic}/>
            <div className='left board-name'>{post.username}</div> {this.deleteButton(post)}
            <br />
            <br />
            <div className='left board-time'>{moment(post.time).format('YYYY-MM-DD HH:mm a')}</div>
            <br />
            <br />
             {post.text}
          </li>
        </div>
      )
    }
  )

    return (
      <div className='board'>
        <div className='input-container'>
          <form className='input-field'>
            <img
              width='32'
              className='repsonsive-img'
              alt='current user avatar'
              src={this.props.currentUser.photoURL}/>
            <input className='validate' onChange={this.updatePost.bind(this)} type="text" placeholder="Write your post here..." id="message"/>
            <br />
            <button onClick={this.submitPost.bind(this)} className="post-button right-align waves-effect waves-light btn" id="message-button" type="submit">Post</button>
          </form>
        </div>
        <h4 className='center-align board-title'><strong>Neighborhood Feed</strong></h4>
        <ul className='message-scroll'>
          {currentPost.reverse()}
        </ul>
      </div>
    )
  }
}

export default Board
