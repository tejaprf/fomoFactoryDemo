import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store';
import { PriceDetail } from '../types/types';
import { setTicker, fetchTickers, startFetchInterval, stopFetchInterval, selectTicker, selectPriceDetails } from '../reducers/tickerReducer';

interface TickerDetailsProps {
  ticker: string;
  tickers: string[];
  priceDetails: PriceDetail[];
  setTicker: (ticker: string) => void;
  fetchTickers: () => void;
  startFetchInterval: (ticker: string) => void;
  stopFetchInterval: () => void;
}

class TickerDetails extends React.Component<TickerDetailsProps> {
  componentDidMount() {
    this.props.fetchTickers(); // Fetch tickers when component mounts
  }

  componentDidUpdate(prevProps: TickerDetailsProps) {
    if (this.props.ticker !== prevProps.ticker) {
      if (this.props.ticker) {
        this.props.startFetchInterval(this.props.ticker); // Start interval when ticker is selected
      } else {
        this.props.stopFetchInterval(); // Stop interval when no ticker selected
      }
    }
  }

  handleSetTicker = (ticker: string) => {
    this.props.setTicker(ticker); // Update selected ticker
  };

  render() {
    const { tickers, priceDetails } = this.props;

    return (
      <div>
        <div style={{display:'flex',justifyContent:'center',alignItems:'baseline'}}>
        <h2>Select Ticker:</h2>
          <select style={{width:'150px',height:'50px',fontSize:'20px',marginLeft:'30px'}} onChange={(e) => this.handleSetTicker(e.target.value)}>
            <option value="">Select Ticker</option>
            {tickers.map((ticker: string, index: number) => (
              <option key={index} value={ticker}>{ticker}</option>
            ))}
          </select>
        </div>
        <h3>Price Details: {this.props.ticker}</h3>
        <table style={{ border: '1px solid #fff', borderCollapse: 'collapse', width: '100%',fontSize:'15px'}}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', textAlign: 'left', padding: '8px' }}>S.NO</th>
              <th style={{ border: '1px solid #fff', textAlign: 'left', padding: '8px' }}>Price ($)</th>
              <th style={{ border: '1px solid #fff', textAlign: 'left', padding: '8px' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {priceDetails.map((detail, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #fff', textAlign: 'left', padding: '8px' }}>{index+1}</td>
                <td style={{ border: '1px solid #fff', textAlign: 'left', padding: '8px' }}>{detail.price}</td>
                <td style={{ border: '1px solid #fff', textAlign: 'left', padding: '8px' }}>{detail.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  ticker: selectTicker(state),
  priceDetails: selectPriceDetails(state),
  tickers: state.ticker.tickers,
});

const mapDispatchToProps = {
  setTicker,
  fetchTickers,
  startFetchInterval,
  stopFetchInterval,
};

export default connect(mapStateToProps, mapDispatchToProps)(TickerDetails);
