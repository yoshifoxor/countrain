import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import Main from './Views/Main';
import Search from './Views/Search';
import TrainInfo from './Views/TrainInfo';
import NotFound from './Components/NotFound';

import registerServiceWorker from './registerServiceWorker';

/** メニューバー */
class NavigationMenu extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand navbar-light fixed-bottom" style={{ backgroundColor: "#e3f2fd"}}>
        <a className="navbar-brand" href="#">CounTrain</a>
        {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar0" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button> */}

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav nav-fill w-100 nav-justified" id="navbar0">
            <li className="nav-item">
              <Link className="nav-link" to="/search">
                <div><i className="fas fa-search"></i><p>駅検索</p></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/main">
                <div><i className="far fa-clock"></i><p>カウントダウン</p></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/info">
                <div><i className="fas fa-th-list"></i><p>鉄道運行情報</p></div>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

const MainApp = () => (
  <div>
    <header className="App-header">
      <h1 className="App-title" style={{letterSpacing: ".2rem", visibility: "hidden"}}>CounTrain</h1>
    </header>
    <main className="container-fluid">
    <BrowserRouter>
      <div>
      <NavigationMenu />
      <Switch>
        <Route exact path='/' component={Search} />
        <Route exact path='/search' component={Search} />
        <Route exact path='/main' component={Main} />
        <Route exact path='/info' component={TrainInfo} />
        <Route component={NotFound} />
      </Switch>
      </div>
    </BrowserRouter>
    </main>
    <footer style={{ height: "100px" }}></footer>
    <script>
      (function($) {
        $('#navbar0 Link').on('click', function(e) {
          e.preventDefault();
          $(this).tab('show');
        })
      })(jQuery);
    </script>
  </div>
);

ReactDOM.render(
  <MainApp />,
  document.getElementById('root')
);

registerServiceWorker();
