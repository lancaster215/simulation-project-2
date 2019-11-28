import React, { useState, useEffect} from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import Title from './Title';
import axios from 'axios';

export default function Chart() {
    const [logo, setLogo] = useState('')
    const [rank, setRank] = useState('')
    const [data, setData] = useState();
    const moneyconverter = (x) =>{
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    useEffect(()=>{
        axios
        .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
        .then(res=>{
            setRank(res.data[0].name)
            setLogo(res.data[0].image)
            axios
            .get(`https://api.coingecko.com/api/v3/coins/${res.data[0].id}/market_chart?vs_currency=USD&days=1`)
            .then(res=>{
                var temp = [];
                res.data.prices.map((x)=>{
                    temp.push({ date: new Date(x[0]*1000).toLocaleTimeString("en-US"), price: x[1]})
                    return temp
                })
                setData(temp)
            })
        })
        
    }, [])

    return (
        <React.Fragment>
            <Title><img width={20} src={logo}></img> {rank} Price Change Percentage Currency</Title>
            <AreaChart
                width={750}
                height={165}
                data={data}
                margin={{
                top: 10, right: 30, left: 0, bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']}/>
                <Tooltip />
                <Area type="monotone" dataKey="price" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        </React.Fragment>
    );
}
