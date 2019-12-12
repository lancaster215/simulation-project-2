import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    }
}));
export default function SellList(){
    const classes = useStyles();
    const [open1, setOpen1] = useState(false);
    const [cvals, setCvals] = useState();
    const [cdetails, setCdetails] = useState([]);
    const [sellvals, setSellvals] = useState([]);
    const [amtsell, setAmtsell] = useState(0)
    const [dynamicCoinPrice, setDCP] = useState();// sets the lates currency_price of the coin

    const moneyconverter = (x) =>{
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    const handleChange1=e=>{
        let coinId = e.target.value
        setCvals(coinId)
        axios
        .get(`http://localhost:4000/transactions/${coinId}`)
        .then(res=>{
            var temp = []
            axios
            .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${res.data.currency_name}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
            .then(res=>{
                setDCP(res.data[0].current_price)
            })
            temp.push({
                cname: res.data.currency_name,
                money: res.data.money, 
                symbol: res.data.symbol,
                t_trans: res.data.total_transact,
                wallet: res.data.wallet,
                coin_amt: res.data.coin_qty,
            })
            setSellvals(...temp)
        })
    }
    const handleClickOpen1 = (e) => {
        setOpen1(true);
        axios
        .get('http://localhost:4000/transactions')
        .then(res=>{
            let temp = []
            let arr = [];
            res.data.map((x)=>{
                if(arr.indexOf(x.currency_name) === -1){
                    arr.reverse().push(x.currency_name)
                    temp.push({ 
                        cname: x.currency_name, 
                        cid: x.id, 
                        cinvest: moneyconverter(x.total_transact/x.currency_price)
                    })
                }
                return temp, arr.reverse()
            })
            setCdetails(temp)
        })
    };
    const handleClose1 = () => {
        setOpen1(false);
    };
    const sell = () => {
        if(amtsell <= sellvals.coin_amt && amtsell >= 0){
            var pre_trans_amt = amtsell * dynamicCoinPrice
            var trans = pre_trans_amt*0.10
            var final_trans = pre_trans_amt+trans
            
            var final_wallet = sellvals.t_trans - final_trans
            var super_wallet = sellvals.wallet + final_wallet

            var final_coinqty= sellvals.coin_amt - amtsell
            axios
            .post('http://localhost:4000/transactions',{
                "transaction": "Sell",
                "currency_name": sellvals.cname,
                "money": sellvals.money,
                "total_transact": final_trans,
                "currency_price": dynamicCoinPrice,
                "coin_qty": final_coinqty,
                "wallet": super_wallet,
                "symbol": sellvals.symbol
            })
        }else{
            alert("Note: Please Enter Amount not exceeding the On Hand Coin Amount and not Below 0")
        }
    }
    const calculate=e=>{
        setAmtsell(e.target.value)
    }
    return(
        <React.Fragment>
            <ListItem button onClick={handleClickOpen1}>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Sell" />
            </ListItem>

            <Dialog onClose={handleClose1} aria-labelledby="customized-dialog-title" open={open1}>
                <DialogTitle id="customized-dialog-title">
                    Sell
                    <div style={{'float': 'right'}}>
                        <IconButton aria-label="close" onClick={handleClose1}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <FormControl className={classes.margin}>
                        <InputLabel htmlFor="select-coin">Select</InputLabel>
                        <NativeSelect //change this to sum of transaction coin, there should be no duplicate coin name
                        id="select-coin"
                        value={cvals}
                        onChange={handleChange1}
                        >
                            <option value="">-</option>
                            {cdetails.map((x)=> (
                                <option key={x.cid} value={x.cid}>Trans.No.{x.cid} 
                                    {x.cname}
                                </option>
                            ))}
                        </NativeSelect>
                        <Typography>
                            On Hand Coin Amount: {sellvals.coin_amt}
                        </Typography>
                        <TextField
                            id="filled-number"
                            label={sellvals.cname}
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                            onChange={calculate}
                        />
                        <span><i><b style={{'color':'red'}}>Note:</b> Please Enter Amount not exceeding the On Hand Coin Amount</i></span>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={sell} color="primary">
                        Sell!
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}