import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg';
import { Component } from 'react';


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(console.log);
  // }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  }

  onRouteChange = (route) => {
    if (route === 'home') {
      this.setState({ isSignedIn: true });
    } else {
      this.setState({ isSignedIn: false });
      this.setState({ boxes: [] })
      this.setState({ imageUrl: '' });
    };
    this.setState({ route: route });
  }

  calculateFacesLocation = (clarifaiFaces) => {

    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    function object_to_bounding_box(object) {
      const bounding_box = object.region_info.bounding_box;
      return {
        leftCol: bounding_box.left_col * width,
        topRow: bounding_box.top_row * height,
        rightCol: width - (bounding_box.right_col * width),
        bottomRow: height - (bounding_box.bottom_row * height),
      };
    }

    const box_array = clarifaiFaces.map(object_to_bounding_box);

    return box_array;
  }

  displayFaceBoxes = (box_array) => {
    this.setState({ boxes: box_array });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    fetch('http://localhost:3000/apicall', {
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(result => {
        const box_array = this.calculateFacesLocation(result);
        this.displayFaceBoxes(box_array);
        if (result.length) {
          fetch("http://localhost:3000/image", {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(userData => {
              console.log(userData);
              if (userData.entries) {
                this.setState(Object.assign(this.state.user, { entries: userData.entries }));
              }
            })
            .catch(error => console.log('error', error));
        }
      })
      .catch(error => console.log('error', error));
  }

  render() {
    if (this.state.route === 'signin') {
      return (
        <div>
          <ParticlesBg type="cobweb" color="#ffffff" bg={true} />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
          <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        </div>
      );
    } else if (this.state.route === 'register') {
      return (
        <div>
          <ParticlesBg type="cobweb" color="#ffffff" bg={true} />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
          <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        </div>
      );
    } else if (this.state.route === 'home') {
      return (
        <div>
          <ParticlesBg type="cobweb" color="#ffffff" bg={true} />
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
          <Logo />
          <Rank user={this.state.user} />
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
          <FaceRecognition boxes={this.state.boxes} imageUrl={this.state.imageUrl} />
        </div>
      );
    }
  }
}

export default App;
