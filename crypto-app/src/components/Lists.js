import React, { useEffect, useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import MaterialTable from 'material-table';
import BuyList from './BuyList';
import SellList from './SellList';
import TransList from './TransList';
import axios from 'axios';

export default function Lists(){
    const [wallet, setWallet] = useState(1000000);
    const [open3, setOpen3] = useState(false);
    const [state, setState] = useState({
        columns: [
            {title: '1hr', field: 'transaction'},
            {title: '24hr', field: 'transaction'},
            {title: '7d', field: 'transaction'},
        ]
    });

    const moneyconverter = (x) =>{
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    const handleClickOpen3=()=>{
        setOpen3(true)
        axios
        .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=bitcoin&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h`)
        .then(res=>{
            let rdata = []
            res.data.map((x) =>{
                rdata.push({
                    transaction: x.transaction,
                    // currency_name: x.currency_name,
                    // currency_price: '$'+moneyconverter(x.currency_price),
                    // invested_c: x.coin_qty,
                    // total_cprice: '$'+moneyconverter(x.total_transact),
                    // time: new Date().toLocaleDateString("en-US"),
                    // total_transact: '$'+moneyconverter(((x.coin_qty*x.currency_price)*0.10)+(x.coin_qty*x.currency_price))
                })
                return rdata;
            })
            setState(e => { return {...e, data:rdata} })
        })
    }
    const handleClose3 = () => {
        setOpen3(false);
    };
    useEffect(()=>{
        axios
        .get('http://localhost:4000/transactions')
        .then(res=>{
            res.data.map((x)=>{
                return setWallet(x.wallet)
            })
        })
    },[])
    return(
        <React.Fragment>
            <BuyList/>
            <SellList/>
            <TransList/>
            <ListItem button onClick={handleClickOpen3}>
                <ListItemIcon>
                    <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Track Investment" />
            </ListItem>
            <Dialog onClose={handleClose3} aria-labelledby="customized-dialog-title" open={open3}>
                <DialogTitle id="customized-dialog-title">
                    Track Investment
                    <div style={{'float': 'right'}}>
                        <IconButton aria-label="close" onClick={handleClose3}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <MaterialTable
                        title=""
                        options={{filtering: false, headerStyle: {backgroundColor: '#f5f5f5'}}}
                        columns={state.columns}
                        data={state.data}
                    />
                </DialogContent>
            </Dialog>
            <ListItem button>
                <ListItemIcon>
                    <AccountBalanceWalletIcon />
                </ListItemIcon>
                <ListItemText primary="Wallet" />
                <ListItemText>{'$'+moneyconverter(Math.round(wallet*100)/100)}</ListItemText>
            </ListItem>
        </React.Fragment>
    );
}