import React, { Component } from 'react';
import { Link } from 'react-router-dom'



class Favorites extends Component {


  render () {
      const address = this.props.address;
      const neighborhood = this.props.neighborhood
      console.log(neighborhood);
      // console.log(address);
      return (
        <div>
          <div className='fav-title'>Saved Address</div>
          <div className='fav-text'>
          <Link to={`${neighborhood.id}`}>{address[4]}</Link>
        </div>
        </div>
      )
    }
}



export default Favorites;
