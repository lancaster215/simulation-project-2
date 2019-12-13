import React, {useEffect, useState} from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';

export default function Coins() {
    const [state, setState] = useState({
        columns: [
            { title: 'Market Cap Rank', field: 'rank', filtering: false },
            { title: 'Currency Symbol', field: 'symbol', filtering: false },
            { title: 'Currency Logo', field: 'logo', filtering: false, render: rowData => <div style={{display: 'flex'}}><img alt="coin-img" src={rowData.logo.img} style={{width: 50, borderRadius: '50%'}}/>&nbsp;<h5>{rowData.logo.name}</h5></div>},
            { title: 'Pair Exchange in 1USD', field: 'pairEx', filtering: false, render: x=> <span>${x.pairEx}</span> },
            { title: 'Market Cap', field: 'mCap', filtering: false, render: x=> <span>${x.mCap}</span>  },
            { title: '24H Total Volume', field: 't_volume', filtering: false, render: x=> <span>${x.t_volume}</span>  },
            { title: 'Updated since', field: 'timechange', filtering: false  }
        ],
    });
    const moneyconverter = (x) =>{
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    useEffect(() =>{
        axios
        .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
        .then(res=>
            {
                let rdata = []
                res.data.map((x) =>{
                    // console.log(x)
                    rdata.push({
                        rank: x.market_cap_rank,
                        symbol: x.symbol,
                        logo: {img: x.image, name: x.name},
                        pairEx: moneyconverter(x.current_price),
                        mCap: moneyconverter(x.market_cap),
                        t_volume: moneyconverter(x.total_volume),
                        timechange: new Date(x.last_updated).toLocaleDateString("en-US"),
                    })
                    return rdata;
            })
            setState(e => { return {...e, data:rdata} })
        })
    }, [])

  return (
    <React.Fragment>
      {/* <Title>Recent Orders</Title> */}
        <MaterialTable
            components={{
                Toolbar: props => (
                  <div className="tableTitle">
                      <h2>Table of Cryptocurrency</h2>
                  </div>
                ),
            }}
            options={{filtering: true, headerStyle: {backgroundColor: '#f5f5f5'}}}
            columns={state.columns}
            data={state.data}
        />
    </React.Fragment>
  );
}