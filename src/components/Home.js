import React, { Component } from 'react';
import axios from 'axios';
import Map from './Map'
import Favorites from './Favorites';
import Header from './Header';
import base from '../rebase';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

window.base = base;

class Home extends Component {

  constructor () {
    super();
    this.state = {
      user: {},
      searchResult: {},
      users: [],
      address: {}
    }
  }


  componentDidMount () {
    base.onAuth(this.setUserState.bind(this));
  }


  setUserState (user) {
    this.setState({
      user: user || {}
    });
    if (user) {
      this.addressSwitch = base.syncState(`users/${user.uid}/address`, {
        context: this,
        asArray: true,
        state: 'address'
      });
      this.userSwitch = base.syncState(`users/${user.uid}`, {
        context: this,
        asArray: true,
        state: 'users'
      });
      const userData = {name: user.displayName, pic: user.photoURL, email: user.email}
      this.setState({
        users: userData
      })

    }
  }


  login () {
    base.authWithOAuthPopup('google', function (){});
  }

  logout () {
    base.unauth()
    base.removeBinding(this.addressSwitch);
    base.removeBinding(this.userSwitch);
  }

  loginOrLogoutButton () {
    if (this.state.user.uid) {
      return <button className="waves-effect waves-light btn" onClick={this.logout.bind(this)}>Logout</button>
    } else {
      return <button className="waves-effect waves-light btn" onClick={this.login.bind(this)}>Login</button>
    }
  }


  formIfLoggedIn () {
    if (this.state.user.uid) {
      return (
        <form onSubmit={this.searchGoogleMaps.bind(this)}>
          <input
            placeholder='Address'
            ref={element => this.addressName = element} />
          <button className="waves-effect waves-light btn">Search for your Neighbors</button>
        </form>
      )
    }
  }


  searchGoogleMaps (event) {
    event.preventDefault();
    const address = this.addressName.value;
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCmStoy8C78sZ6lX2BvPYK3UuwYfx_CvhE`)
    .then(response => this.setState({ searchResult: response.data.results[0] }));
    this.addressName.value = '';
  }


  displaySearchResults () {
    if (this.state.searchResult.geometry && this.state.user.uid) {
      const result = this.state.searchResult;
      const marker = { position: result.geometry.location }

      return (
        <div>
          <h5>{result.formatted_address}</h5>
          <div className="map">
             <Map
               addressResult={result}
               center={result.geometry.location}
               zoom={16}
               markers={[marker]}
               addAddress={this.addAddress.bind(this)}
               containerElement={<div style={{ height: `100%` }} />}
               mapElement={<div style={{ height: `100%` }} />}
              />
          </div>
        </div>
      )
    } else {
      return null
    }
  }


  addAddress(address){
    const addressData = {name: address.formatted_address, location: address.geometry.location, id: address.place_id}
      this.setState({
        address: addressData,
      })
}





  displayNeighborhoods() {
    if(this.state.address && this.state.user.uid) {
      const result = this.state.address
      return (
        <div>
          <h5><strong>Address</strong></h5>
          <ul>
            <Favorites address={result} />
          </ul>
        </div>
      )
    }
  }




  render() {
    return (
        <div>
          <Header
            user={this.state.user}
          />
          <div className="log">
            {this.loginOrLogoutButton()}
          </div>
          <div className="row">
            <div className="col s2 Favorites">
              {this.displayNeighborhoods()}
            </div>
            <div className="col s10">
              {this.formIfLoggedIn()}
              {this.displaySearchResults()}
            </div>
          </div>
        </div>
    );
  }
}

export default Home;
