import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      rates: {}
    };
  }

  componentDidMount() {
    fetch("https://api.exchangeratesapi.io/latest?base=USD") 
      .then(res => res.json()) 
      .then(
        result => {
          this.setState({
            isLoaded: true,
            rates: result.rates
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  prettyCurrency = (crr, action) => {
    if (action === 0) {
      crr = (crr * 102) / 100;
    } else if (action === 1) {
      crr = (crr * 98) / 100;
    } else {
      // Do nothing...
    }
    var fixedCrr = crr.toFixed(4).toString();
    while (fixedCrr.length < 8) {
      fixedCrr = "0" + fixedCrr;
    }

    return fixedCrr;
  };

  createTable = () => {
    const rates = this.state;
    let ratesArr = Object.keys(rates).map(i => rates[i])[2];
    let table = [];
    let children = [];
    let displayedCurrencies = ["IDR", "CAD", "USD", "CHF", "JPY", "EUR"];

    
    for (var key in ratesArr) {
      if (ratesArr.hasOwnProperty(key) && displayedCurrencies.includes(key)) {
        children.push(
          <tr>
            <td>{key}</td>
            <td>{this.prettyCurrency(ratesArr[key], 0)}</td>
            <td>{this.prettyCurrency(ratesArr[key])}</td>
            <td>{this.prettyCurrency(ratesArr[key], 1)}</td>
          </tr>
        );
      }
    }
    table.push(<tbody>{children}</tbody>); 

    return table;
  };

  render() {
    const { error, isLoaded } = this.state;

    if (error) {
      return <div>Oops: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <main>
          <div className="App-body">
            <table className="currencyTable">
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>WE BUY</th>
                  <th>EXCHANGE RATE</th>
                  <th>WE SELL</th>
                </tr>
              </thead>
              {this.createTable()}
            </table>
            <p>
              * base currency is USD
              <br />* As for the API,&nbsp;
              <a href="https://exchangeratesapi.io/">
                https://exchangeratesapi.io/
              </a>
              &nbsp;is used.
            </p>
          </div>
        </main>
      );
    }
  }
}

export default App;
