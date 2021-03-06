import React, { Component } from 'react';
import axios from 'axios';
import Map from './Map'
import Favorites from './Favorites';
import Profile from './Profile';
import Header from './Header';
import Footer from './Footer';
import base from '../rebase';
import gju from 'geojson-utils';
var data = require('/Users/tylerdavis/TIY/neighborhood.json');
window.Vel = require('materialize-css/js/velocity.min');
import logo6 from '../../public/images/logo-launch3.svg'



window.base = base;

class Home extends Component {

  constructor () {
    super();
    this.state = {
      user: {},
      searchResult: {},
      users: [],
      address: {},
      neighborhood: {}
    }
  }


  componentDidMount () {
    base.onAuth(this.setUserState.bind(this));

  }


  setUserState (user) {
    this.setState({
      user: user || {},
    });
    if (user) {
      this.addressSwitch = base.syncState(`users/${user.uid}/address`, {
        context: this,
        asArray: true,
        state: 'address'
      });
      this.userSwitch = base.syncState(`users/${user.uid}`, {
        context: this,
        asArray: false,
        state: 'users'
      });
      const userData = {name: user.displayName, pic: user.photoURL, email: user.email, uid: user.uid}
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
      return null
    } else {
      return (
        <div className='logo-container center-align'>
          <div className='col s12 m6'>
            <img
              className='logo'
              alt='logo'
              src={logo6} />
            <br />
            <button className="waves-effect waves-light btn" onClick={this.login.bind(this)}>Login</button>
          </div>
        </div>
      )
    }
  }


//map searching starts here

  formIfLoggedIn () {
    if (this.state.user.uid) {
      return (
        <div className="container search">
          <form onSubmit={this.searchGoogleMaps.bind(this)}>
            <input
              type='search'
              className='center-align search-text'
              placeholder='Search address here...'
              ref={element => this.addressName = element} />  {/* storing what you put in the form in this.adressName */}
          </form>
        </div>
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


  displayMap () {
    if (this.state.searchResult.geometry && this.state.user.uid) {
      const result = this.state.searchResult;
      const marker = { position: result.geometry.location }

      return (
        <div className='outer-container'>
          <div className='map-container'>
            <span onClick={this.closeMap.bind(this)} className="close btn right">&times;</span>
            <h5>{result.formatted_address}</h5>
            <br />
               <Map
                 addressResult={result}
                 center={result.geometry.location}
                 zoom={17}
                 markers={[marker]}
                 addAddress={this.addAddress.bind(this)}
                 containerElement={<div id='containerElement' />}
                 mapElement={<div id='mapElement' />}
                />
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  closeMap() {
    this.setState({
      searchResult: {},
    })
  }



  addAddress(address){
    const lng = address.geometry.location.lng
    const lat = address.geometry.location.lat
    //this uses the geojson utils tool to locate the neighborhood. Stores in neighborhood variable
    const neighborhood = data.features.find(location => { //data.features is stored on computer.
      return gju.pointInPolygon({"type":"Point","coordinates":[ lng, lat ]}, //I took shp files from zillow and converted to json
                    {"type":"Polygon", "coordinates":[location.geometry.coordinates[0]]}) //then used the gju.pointInPolygon to find the neighborhood that the lat and lng is in
    });

    if (neighborhood === undefined) {
      return (
        window.alert('This address is currently not supported. More neighborhoods coming soon. Please choose another address in Florida.')
      )
    } else {

      const addressData = {name: address.formatted_address, location: address.geometry.location, lat: address.geometry.location.lat, lng: address.geometry.location.lng, id: address.place_id}
        this.setState({
          address: addressData,
        })

      const neighborhoodData = { city: neighborhood.properties.City, name: neighborhood.properties.Name, id: neighborhood.properties.RegionID }
        if (!this.state.neighborhood[neighborhoodData.id]) { //if the neighborhood state does not include region id already, then update FB
          base.update(`neighborhoods/${neighborhood.properties.RegionID}`, {
            data: neighborhoodData
          })
        }
        base.update(`neighborhoods/${neighborhood.properties.RegionID}/users/${this.state.users.uid}`, {
          data: this.state.users
        })
        base.update(`users/${this.state.users.uid}/neighborhood`, { //I update the users/ in fb with the neighborhood so that I can pass it into the favorites
          data: neighborhoodData
        })
    }
}


  displayNeighborhoods() {
    if(this.state.address[0] && this.state.user.uid && this.state.neighborhood) {
      const address = this.state.address
      const neighborhood = this.state.users.neighborhood
      return (
          <div className='favorites left z-depth-4'>
            {this.state.users.neighborhood &&
            <Favorites
              address={address}
              neighborhood={neighborhood}
            />}
          </div>
      )
    } else return null
  }





// the below sections are conditionals that display the home page elements
// depending on if users are logged in

  displayProfile() {
    if(this.state.user.uid) {
      const user = this.state.user
      return (
        <div className='profile left z-depth-4'>
          <Profile
            user={user}
          />
        </div>
      )
    }
  }

  displayHeader () {
    if(this.state.user.uid) {
      const user = this.state.user
      return (
        <Header
          user={user}
          logout={this.logout.bind(this)}
          neighborhood={this.state.neighborhood}
        />
      )
    }
  }

  // displayFooter() {
  //   if(this.state.user.uid) {
  //     return (
  //       <Footer
  //       />
  //     )
  //   }
  // }



  render() {
    return (
      <div>
        <div className='home'>
          {this.loginOrLogoutButton()}
          {this.displayHeader()}
          <div className='row'>
            <div className='col s12'>
              {this.displayProfile()}
              {this.displayNeighborhoods()}
            </div>
          </div>
            {this.formIfLoggedIn()}
            {this.displayMap()}
          </div>
          {/* {this.displayFooter()} */}
      </div>
    )
  }
}

export default Home;
