import React, { useEffect, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    }
}));
export default function BuyList(){
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [values, setvalues] = useState();
    const [price, setPrice] = useState(0);
    const [mprice, setMPrice] = useState(0);
    const [open, setOpen] = useState(false);
    const [wallet, setWallet] = useState(0);
    const [coinqty, setCoinQty] = useState(0); // the input num: the user input the coin qty to buy
    const [acoin, setACoin] = useState(); //the coin qty 
    const [lastcname, setLastcname]= useState();

    const handleChange=e=>{
        setMPrice(0)
        setvalues(e.target.value); //id
        axios
        .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${e.target.value}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
        .then(res=>{
            var temp = []
            res.data.map((x)=>{
                temp.push({ 
                    price: x.current_price, 
                    symbol: x.symbol
                })
                return temp
            })
            setPrice(...temp)
        })
    };
    const multiply=e=>{
        var num = e.target.value //input num
        setCoinQty(e.target.value)
        if(num > 0){
            var prefinal = price.price * num
            var final = prefinal*0.10
            var superf = prefinal+final
            setMPrice(superf)
        }else{
            setMPrice(0)
        }
    }
    const handleClickOpen = (e) => {
        setOpen(true);
        axios
        .get('http://localhost:4000/transactions')
        .then(res=>{
            setLastcname(res.data[res.data.length - 1].currency_name)
            var temp = res.data[res.data.length - 1]
            temp ? setACoin(temp.coin_qty) : setACoin(0)
        })
    };
    const handleClose = () => {
        setOpen(false);
    };
    const purchase = () => {
        var finalwallet = wallet-mprice
        if(lastcname !== values){
            var anotherone = parseInt(coinqty)
        }else{
            var anotherone = parseInt(coinqty) + parseInt(acoin)
        }
        axios
        .post('http://localhost:4000/transactions',{
            "transaction": "Buy",
            "currency_name": values,
            "money": "USD",
            "total_transact": mprice,
            "currency_price": price.price,
            "coin_qty": coinqty,
            "wallet": finalwallet,
            "symbol": price.symbol,
            "available_coin": anotherone,
        }).then(res=>{
            alert('Successfully Purchased!')
        }).catch(err=>{alert('Error!')})
        window.location.reload(true)
    }
    useEffect(()=>{
        axios
        .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        .then(res=>{
            axios
            .get('http://localhost:4000/transactions')
            .then(res=>{
                var thismoney = res.data[res.data.length - 1];
                thismoney ? setWallet(thismoney.wallet): setWallet(1000000)
            })
            var temp = [];
            res.data.map((x)=>{
                temp.push({ id: x.id, name: x.name,})
                return temp
            })
            setData(temp)
        })
    },[wallet])
    return(
        <React.Fragment>
            <ListItem button onClick={handleClickOpen}>
                <ListItemIcon>
                    <MonetizationOnIcon />
                </ListItemIcon>
                <ListItemText primary="Buy" />
            </ListItem>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogContent>
                    <FormControl className={classes.margin}>
                        <InputLabel htmlFor="select">Select a Coin</InputLabel>
                        <NativeSelect
                            id="select"
                            value={values}
                            onChange={handleChange}
                        >
                            <option value="">-</option>
                            {data.map((x)=> (
                                <option key={x.id} value={x.id}>{x.name}</option> 
                            ))}
                        </NativeSelect>
                    </FormControl>
                </DialogContent>
                <DialogTitle id="customized-dialog-title">
                    Buy {values}
                    <div style={{'float': 'right'}}>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        id="filled-number"
                        label={values}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="filled"
                        onChange={multiply}
                    />
                </DialogContent>
                <DialogContent dividers>
                    <div style={{'display':'flex'}}>
                        <h1><b>Value: </b></h1>
                        <h1> ${price.price}</h1>
                    </div>
                    <div style={{'display':'flex'}}>
                        <h1><b>Total: </b></h1>
                        <h1> ${mprice}</h1>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={purchase} color="primary">
                        Purchase!
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}