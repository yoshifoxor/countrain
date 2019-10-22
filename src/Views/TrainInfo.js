import React, { Component } from 'react';
import request from 'superagent';
import jmespath from 'jmespath';

/** 鉄道運行情報ページ */
export default class TrainInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stationName: '',
      stationCode: '',
      informations: [],
      infoList: [],
    };
    this.infoUrl = `./data/information.json`;
  }

  getInfo() {
    request.get(`${this.infoUrl}`)
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          console.log('JSON読み込みエラー');
          return;
        }
        const ResultSet = jmespath.search(res.body, 'ResultSet');
        const Informations = ResultSet.Information;
        // console.log(Informations);
        this.setState({ informations: Informations });

        this.setState({
          infoList: this.state.informations
            .map((item, i) =>
              <div className="list-group-item" key={i}>
                <div>{item.Title}</div>
                <div>{item.Comment[0].text}</div>
              </div>
            )
        });
    });
  }

  componentWillMount() {
    this.getInfo();
  }

  render() {
    return (
      <div id="TrainInfo">
        <h3 className="text-center">以下はサンプルのデータです。</h3>

        <div className="list-group" id="infoList">
          {this.state.infoList}
        </div>
      </div>
    );
  }
};
