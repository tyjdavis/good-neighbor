import React, { Component } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox'
import LargeProfile from './LargeProfile';
import Weather from './Weather';
import Board from './Board';
import Footer from './Footer';
import Events from './Events';
import Header from './Header'
import base from '../rebase';
var $ = window.jQuery = require('jquery');
window.Vel = require('materialize-css/js/velocity.min')
import materialize from 'materialize-css';

window.base = base;

class ZillowNeighborhoods extends Component {


  constructor () {
    super();
    this.state = {
      users: {},
      currentUser: {},
      filteredUsers: [],
      text: [],
      neighborhood: [],

      chatDisplay: {
        display: true,
        selectedUser: {}
      }

    }
  }



  componentDidMount(){
    base.fetch(`neighborhoods/${this.props.match.params.id}`, {
      context: this,
      asArray: false })
      .then(response => this.setState({ neighborhood: response }))

    base.onAuth(this.setUserState.bind(this));

    $('.modal').modal();

  }

  setUserState (currentUser) {
    this.setState({
      currentUser: currentUser || {}
    });
  }

  convertUsersToArr(users){
    let arr = Object.keys(users)
    return arr.map((iteration, i) => {
      return users[iteration]
    })
  }

  displayNeighbors(){
    if (this.state.neighborhood.id && this.state.currentUser) {
      let usersArr = this.convertUsersToArr(this.state.neighborhood.users);
    const currentUser = this.state.currentUser
    return(
      <div>
        <br />
        <h5 className='center-align hood-title'>Your Neighbors:</h5>
        <ul>
          {usersArr.map((user) => {
            if(currentUser.displayName === user.name) {
              return null

            } else {
              return  (
                <div className='users-in-hood'>
                  <div className='center-align'>
                  {user.name}
                  </div>
                  <br />
                  <li className=''>
                    <div className='col s12 center-align'>
                    <img
                    width='105'
                    className='avatar repsonsive-img z-depth-4 neighbors-pic'
                    src={user.pic} />
                  </div>
                  <div className='row'>
                    <div className='col s6 m12 center-align'>
                      <a href={`mailto:${user.email}`}><button className="waves-effect waves-light btn">Email</button></a>
                    </div>
                    <br />
                    <div className='col s6 m12 center-align'>
                       <button data-target="modal1" className="waves-effect waves-light btn" onClick={this.buttonClick.bind(this, user)}>Chat</button>
                    </div>
                  </div>
                  </li>
                </div>
              )
            }
          })}
        </ul>
      </div>
    )
  }
  }

  buttonClick (user){
    console.log(user);
    this.setState({ chatDisplay: {display: this.state.chatDisplay.display, selectedUser: user}})
  }


  showChatBox(){
    if (this.state.chatDisplay.display && this.state.chatDisplay.selectedUser.uid) {
      return (
        <ChatBox
          user={this.state.chatDisplay.selectedUser}
          currentUser={this.state.currentUser}
          userKey={this.state.chatDisplay.selectedUser.uid}
        />
      )
    } else {
    return null
    }
  }






  render() {
    return (
      <div className='col s12'>
        <Header
          user={this.state.currentUser}
        />
        <br />
        <div className='row'>
          <div className='col s12 m2'>
            <LargeProfile
              user={this.state.currentUser}
            />
            {this.displayNeighbors()}
          </div>

          <div className='col s12 m7'>
            <Board
              neighborhood={this.state.neighborhood}
              id={this.props.match.params.id}
              currentUser={this.state.currentUser}
            />
          </div>
          <div className='col s12 m3'>
            <Events
              location={this.props.address}
            />
            <Weather
              location={this.props.address}
            />
          </div>
          <div id="modal1" className="modal">
            {this.showChatBox()}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}


//   constructor () {
//     super();
//     this.state = {
//       users: {},
//       currentLocation: {},
//       currentUser: {},
//       filteredUsers: [],
//       text: [],
//
//       chatDisplay: {
//         display: true,
//         selectedUser: {}
//       }
//
//     }
//   }
//
//   componentDidMount(){
//     base.fetch('users', {
//       context: this,
//       asArray: true })
//       .then(response => this.setState({ users: response }))
//
//     const addressId = this.props.match.params.id;
//       axios.get(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${addressId}&key=AIzaSyCmStoy8C78sZ6lX2BvPYK3UuwYfx_CvhE`)
//       .then(response => this.setState({ currentLocation: response.data.results[0].geometry.location }))
//
//     base.onAuth(this.setUserState.bind(this));
//
//     $('.modal').modal();
//   }
//
//
//   setUserState (currentUser) {
//     this.setState({
//       currentUser: currentUser || {}
//     });
//   }
//
//
//   filterStuff() {
//     if (this.state.users[0]) {
//     let currentLocation = this.state.currentLocation
//     let allUsers = this.state.users
//     const acceptableDistance = 0.02
//
//     let filteredUsers = allUsers.filter(users => {
//       let lat = users.address.location.lat
//       let lng = users.address.location.lng
//       let latResult = Math.abs(currentLocation.lat - lat)
//       let lngResult = Math.abs(currentLocation.lng - lng)
//       return (latResult <= acceptableDistance && lngResult <= acceptableDistance)
//     })
//     // console.log(filteredUsers)
//     let currentUserName = this.state.currentUser.displayName
//     return (
//       <div>
//         <h5 className='center-align hood-title'>Your Neighbors:</h5>
//         <ul>
//           {filteredUsers.map((user) => {
//             if(currentUserName === user.name) {
//               return null
//
//             } else {
//               return  (
//                 <div className='users-in-hood'>
//                   <div className='center-align'>
//                   {user.name}
//                   </div>
//                   <br />
//                   <li className='row'>
//                     <div className='col s6 center-align'>
//                     <img
//                     width='105'
//                     className='avatar repsonsive-img z-depth-4 neighbors-pic'
//                     src={user.pic} />
//                   </div>
//                     <div className='col s6 center-align'>
//                     <a href={`mailto:${user.email}`}><button className="waves-effect waves-light btn">Email</button>
//                     <br />
//                   <br />
//                   </a> <button data-target="modal1" className="waves-effect waves-light btn" onClick={this.buttonClick.bind(this, user)}>Chat</button>
//                 </div>
//                   </li>
//                 </div>
//               )
//             }
//           })}
//         </ul>
//       </div>
//     )
//   }
// }
//
// buttonClick (user){
//   this.setState({ chatDisplay: {display: this.state.chatDisplay.display, selectedUser: user}})
// }
//
// showChatBox(){
//   if (this.state.chatDisplay.display && this.state.chatDisplay.selectedUser.key) {
//     return (
//       <ChatBox
//         user={this.state.chatDisplay.selectedUser}
//         currentUser={this.state.currentUser}
//         userKey={this.state.chatDisplay.selectedUser.key}
//       />
//     )
//   } else {
//   return null
//   }
// }
//
//
//   render() {
//     console.log(this.state.currentUser)
//     return (
//       <div className='col s12'>
//         <Header
//           user={this.state.currentUser}
//         />
//         <br />
//         <div className='row'>
//           <div className='col s12 m2'>
//             <LargeProfile
//               user={this.state.currentUser}
//             />
//             <Weather
//               location={this.state.currentLocation}
//             />
//           </div>
//
//           <div className='col s12 m7'>
//             {this.filterStuff()}
//           </div>
//
//           <div className='col s12 m3'>
//
//             <Events
//               location={this.state.currentLocation}
//             />
//           </div>
//           <div id="modal1" className="modal">
//             {this.showChatBox()}
//           </div>
//         </div>
//         <Footer />
//       </div>
//     )
//   }


export default ZillowNeighborhoods;


//weather added?



//key 3b84b26c3406410fa0ed43848278f4dc


// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=3b84b26c3406410fa0ed43848278f4dc


// http://api.openweathermap.org/data/2.5/weather?q=Oviedo,FL&appid=3b84b26c3406410fa0ed43848278f4dc&units=imperial

// wunderground apikey
//
// 24532f7c67079974
