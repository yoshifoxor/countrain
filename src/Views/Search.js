import React, { Component } from 'react';
import { withRouter } from 'react-router';
import request from 'superagent';
import jmespath from 'jmespath';

import { accesskey, storage } from '../config';

/** 駅名検索ページ */
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationName: '',
      prevSearch: '',
      stationCode: 0,

      optionValues: [],
      points: [],
      timetables: [],
      pointList: [],
      timetableList: []
    };
    this.stationUrl = `http://api.ekispert.jp/v1/json/station/light?key=${accesskey}`;

    this.timetableUrl = `http://api.ekispert.jp/v1/json/operationLine/timetable?key=${accesskey}`;

    this.doSelect = this.doSelect.bind(this);
    this.doSubmit = this.doSubmit.bind(this);
    this.doSave = this.doSave.bind(this);
  }

  componentDidMount() {
    this.renderList();
  }

  doChange(e) {
    const newValue = e.target.value;
    if (newValue != this.state.prevSearch) {
      this.setState({ prevSearch: this.state.stationName });
    }
    this.setState({ stationName: newValue });
  }

  doSubmit(e) {
    const newValue = this.state.stationName;
    e.preventDefault();

    if (newValue == this.state.prevSearch) {
      console.log('Cannot submit');
      return;
    } else {
      request.get(encodeURI(`${this.stationUrl}&type=train&name=${this.state.stationName}`))
        .accept('application/json')
        .end((err, res) => {
          this.searchPoints(err, res);
        });
    }
  }

  getPoints(res) {
    const ResultSet = jmespath.search(res.body, 'ResultSet');
    const Points = ResultSet.Point;

    if (Array.isArray(Points)) {
      this.setState({ points: Points });
    } else {
      this.setState({ points: [Points] });
    }
  }

  searchPoints(err, res) {
    if (err) {
      console.log('JSON読み込みエラー');
      return;
    }

    this.getPoints(res);
    this.renderList();
  }
  renderList() {
    this.setState({
      optionValues: this.state.points
        .map(item => <option value={item.Station.Name} />),
      pointList: this.state.points
        .map(item =>
          <button type="button" className="btn list-group-item list-group-item-action" key={item.Station.code} value={item.Station.Name} onClick={e=>this.doSelect(e)}>
            <div>{item.Station.Name}</div>
          </button>
        )
    });
  }

  doSelect(e) {
    const newValue = e.target.value;
    e.preventDefault();

    this.setState({ stationName: newValue, });

    if (newValue == this.state.prevSearch) {
      console.log('Cannot submit');
      return;
    } else {
      request.get(encodeURI(`${this.timetableUrl}&stationName=${this.state.stationName}`))
        .accept('application/json')
        .end((err, res) => {
          if (err) {
            console.log('JSON読み込みエラー');
            return;
          }
          const ResultSet = jmespath.search(res.body, 'ResultSet');
          const Timetables = ResultSet.TimeTable;

          if (Array.isArray(Timetables)) { this.setState({ timetables: Timetables }); }
          else {this.setState({ timetables: [Timetables] });}

          this.setState({
            timetableList: this.state.timetables
              .map(item => {
                const lc = item.Line.Color + '';
                const [r, g, b] = [lc.substr(0, 3), lc.substr(3, 3), lc.substr(6, 3)];

                return <button type="submit" className="btn list-group-item list-group-item-action" key={item.code} value={item.code} onClick={e => this.doSave(e, item)} style={{backgroundColor: `rgba(${r},${g},${b},0.3)`}}>
                  <div>{item.Station.Name}</div>
                  <div>{item.Line.Name}</div>
                  <div>{item.Line.Direction}</div>
                </button>;
              })
          });
        });
    }
  }

  doSave(e, item) {
    request.get(encodeURI(`${this.timetableUrl}&stationName=${item.Station.Name}&code=${item.code}`))
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          console.log('JSON読み込みエラー');
          return;
        }
        const ResultSet = jmespath.search(res.body, 'ResultSet');
        const Timetable = ResultSet.TimeTable;

        // 取得したJsonデータをセッションストレージに保管
        storage.save('tt', Timetable);

        setTimeout(() => {
          this.props.history.push('/main');
        }, 1000);
      });
  }

  render() {
    return (
      <div id="Search">
        <div className="input-group mb-3 col-md-6 mx-auto">
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">
              <i className="fas fa-search"></i>
            </span>
          </div>
          <input type="text" id="station" className="form-control-lg" placeholder="駅名を入力" aria-label="StationName" aria-describedby="basic-addon1" value={this.state.stationName} onChange={e => this.doChange(e)} list="dl" />
          <datalist id="dl"> {this.state.optionValues} </datalist>
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" id="button-addon1" onClick={e=>this.doSubmit(e)}>検索</button>
          </div>
        </div>

        <div className="row mw-90 mx-auto">
          <div className="list-group mb-5 col-md" id="pointList">
            <h3>駅名候補</h3>
            {this.state.pointList}
          </div>

          <div className="list-group mb-5 col-md" id="ttList">
            <h3>路線候補</h3>
            {this.state.timetableList}
          </div>
        </div>
      </div>
    );
  }
};

export default withRouter(Search);
