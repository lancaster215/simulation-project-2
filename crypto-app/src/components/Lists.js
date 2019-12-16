import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import BuyList from './BuyList';
import SellList from './SellList';
import TransList from './TransList';
import axios from 'axios';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    }
}));
export default function Lists(){
    const classes = useStyles();
    const [wallet, setWallet] = useState(0);
    const [open3, setOpen3] = useState(false);
    const [bought, setBought] = useState([])
    const [values, setValues] = useState()
    const [latest, setLatest] = useState([]);

    const moneyconverter = (x) =>{
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    const handleClickOpen3=()=>{
        setOpen3(true)
        axios
        .get('http://localhost:4000/transactions')
        .then(res=>{
            var temp = []
            let arr = [];
            res.data.map((x)=>{
                if(arr.lastIndexOf(x.currency_name) === -1){
                    arr.reverse().push(x.currency_name)
                    if(x.transaction === "Buy"){
                        temp.push({ id: x.id, c_name: x.currency_name, cprice: x.currency_price, coin_qty: x.coin_qty})
                        // cprice is the value of the coin on the moment the user bought the coin
                    }
                }
                return temp;
            })
            setBought(temp)
        })
    }
    const hour=()=>{
        axios
        .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=${values}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h`)
        .then(res=>{
            res.data.map((x) =>{
                let latest_p = x.current_price
                console.log(latest_p)
                let temp = [];
                bought.map(x=>{
                    if(x.c_name === values){
                        let profit_loss = (latest_p*x.coin_qty)-(x.cprice*x.coin_qty)
                        temp.push({p_loss: profit_loss})
                    }
                    return temp
                })
                setLatest(...temp)
            })
        })
    }
    const day=()=>{
        axios
        .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=${values}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`)
        .then(res=>{
            res.data.map((x) =>{
                let latest_p = x.current_price
                console.log(latest_p)
                let temp = [];
                bought.map(x=>{
                    if(x.c_name === values){
                        let profit_loss = (latest_p*x.coin_qty)-(x.cprice*x.coin_qty)
                        temp.push({p_loss: profit_loss})
                    }
                    return temp
                })
                setLatest(...temp)
            })
        })
    }
    const s_days=()=>{
        axios
        .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=${values}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=7d`)
        .then(res=>{
            res.data.map((x) =>{
                let latest_p = x.current_price
                console.log(latest_p)
                let temp = [];
                bought.map(x=>{
                    if(x.c_name === values){
                        let profit_loss = (latest_p*x.coin_qty)-(x.cprice*x.coin_qty)
                        temp.push({p_loss: profit_loss})
                    }
                    return temp
                })
                setLatest(...temp)
            })
        })
    }
    const handleClose3 = () => {
        setOpen3(false);
    };
    const selectcoin=e=>{
        setValues(e.target.value)
    }
    useEffect(()=>{
        axios
        .get('http://localhost:4000/transactions')
        .then(res=>{
            var thismoney = res.data[res.data.length - 1];
            thismoney ? setWallet(thismoney.wallet): setWallet(1000000)
        })
    },[wallet])
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
                    <FormControl className={classes.margin}>
                        <InputLabel htmlFor="select">Coin</InputLabel>
                        <NativeSelect
                            id="select"
                            value={values}
                            onChange={selectcoin}
                            // input={<BootstrapInput />}
                        >
                            <option value="">-</option>
                            {bought.map((x)=> (
                                <option key={x.id} value={x.c_name}>{x.c_name}</option> 
                            ))}
                        </NativeSelect>
                    </FormControl>
                    <div style={{'display': 'flex', 'marginTop': '20px'}}>
                        <Button onClick={hour} variant="outlined">1 Hour</Button>
                        <Button onClick={day} variant="outlined">1 Day</Button>
                        <Button onClick={s_days} variant="outlined">7 Days</Button>
                    </div><br/>
                    <Typography>Profit/Loss: {'$'+moneyconverter(Math.round(latest.p_loss*100)/100)}</Typography><br/>
                    <span><i><b style={{'color':'red'}}>Note:</b> This will be your Profit once you sold a coin</i></span>
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