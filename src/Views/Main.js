import React, { Component } from 'react';
import Swiper from 'react-id-swiper';

import jmespath from 'jmespath';
import dateformat from 'dateformat';
import Countdown from '../Components/Countdown';
import { storage2, times } from '../config';

/** 時刻表ページ */
export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lineColor: '000000000',
      route: '',
      station: 'station',
      desc: '',
      next: '',
      dir: '',

      countdownList: [],
      dates: []
    };

    this.swiper = null;
  }

  componentWillMount() {
    const json = storage2.get('tt');

    this.setState({
      lineColor: jmespath.search(json, 'Line.Color'),
      route: jmespath.search(json, 'Line.Name'),
      station: jmespath.search(json, 'Station.Name'),
      desc: jmespath.search(json, 'Line.Direction'),
      next: '',
      dir: '',
    });

    const today = dateformat(new Date(), 'yyyy-mm-dd');
    const dateList = [];
    times.forEach((e) => { dateList.push(`${today}T${e}:00`);});

    this.setState({
      countdownList: dateList.map(date => {
        const t = dateformat(date, 'HH時MM分');
        return <div className="swiper-slide">
          <div id="next" className="h3 text-center">{/* 出発時間: */}{t} 発</div>
          <div id="dir" className="h3 text-center">{/* 行き先: */}</div>
          <p className="h1 text-center"> <Countdown date={date} /> </p>
        </div>;
      })
    });
  }

  render() {
    const params = {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      initialSlide: 100,
      autoplay: {
        delay: 10000,
        disableOnInteraction: false
      },
    };
    const lc = this.state.lineColor;
    const [r, g, b] = [lc.substr(0, 3), lc.substr(3, 3), lc.substr(6, 3)];

    return (
      <div id="Main" className="mw-90 mx-auto">
        <div id="route" className="h3 text-center" style={{backgroundColor: `rgba(${r},${g},${b},0.3)`}}>{/* 路線名: */}{this.state.route}</div>
        <div id="station" className="h1 text-center">{/* 駅名: */}{this.state.station} 駅</div>
        <div id="desc" className="h3 text-center">{/* 方面: */}{this.state.desc} 方面</div>

        <Swiper {...params} ref={node => { if (node) this.swiper = node.swiper; } }>
          {this.state.countdownList}
        </Swiper>

        <h5 className="text-center">※実際の時間とは異なる場合があります。</h5>
      </div>
    );
  }
};
