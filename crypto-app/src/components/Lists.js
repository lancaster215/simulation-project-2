import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import MaterialTable from 'material-table';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import Slider from '@material-ui/core/Slider';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 150,
    }
}));
export default function Lists(){
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [values, setvalues] = useState();
    const [price, setPrice] = useState(0);
    const [mprice, setMPrice] = useState(0);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [state, setState] = useState({
        columns: [
            {title: 'Transaction', field: 'transaction'},
            {title: 'Date of Transaction', field: 'time'},
            {title: 'Name of Coin', field: 'currency_name'},
            {title: 'Price of Currency', field: 'currency_price'},
            {title: 'Coin Amount Invested', field: 'invested_c'},
            {title: 'Total Transact', field: 'total_transact'},
        ]
    })
    const [cvals, setCvals] = useState();
    const [cdetails, setCdetails] = useState([]);
    const [wallet, setWallet] = useState(1000000);

    const moneyconverter = (x) =>{
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    const handleChange=e=>{
        setMPrice(0)
        setvalues(e.target.value); //id
        axios
        .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${e.target.value}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
        .then(res=>{
            var temp = []
            res.data.map((x)=>{
                temp.push({ price: x.current_price, symbol: x.symbol})
                return temp
            })
            setPrice(...temp)
        })
    };
    const multiply=e=>{
        var num = e.target.value //input num
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
    };
    const handleClose = () => {
        setOpen(false);
    };


    const handleChange1=e=>{
        setCvals(e.target.value)
    }
    const handleClickOpen1 = (e) => {
        setOpen1(true);
        axios
        .get('http://localhost:4000/transactions')
        .then(res=>{
            let temp = []
            res.data.map((x)=>{
                temp.push({ cname: x.currency_name, cid: x.id, cinvest: moneyconverter(x.total_transact/x.currency_price)})
                return temp
            })
            setCdetails(temp)
        })
    };
    const handleClose1 = () => {
        setOpen1(false);
    };


    const handleClickOpen2 = (e) => {
        setOpen2(true);
        axios
        .get('http://localhost:4000/transactions')
        .then(res=>{
            let rdata = []
            res.data.map((x) =>{
                rdata.push({
                    transaction: x.transaction,
                    currency_name: x.currency_name,
                    currency_price: '$'+moneyconverter(x.currency_price),
                    invested_c: moneyconverter(x.total_transact/x.currency_price),
                    total_transact: '$'+moneyconverter(x.total_transact),
                    time: new Date().toLocaleDateString("en-US"),
                })
                return rdata;
            })
            setState(e => { return {...e, data:rdata} })
        })
    };
    const handleClose2 = () => {
        setOpen2(false);
    };


    const purchase = () => {
        var finalwallet = wallet-mprice
        axios
        .post('http://localhost:4000/transactions',{
            "transaction": "Buy",
            "currency_name": values,
            "money": "USD",
            "total_transact": mprice,
            "currency_price": price.price,
            "wallet": finalwallet,
            "symbol": price.symbol
        }).then(res=>{
            alert('Successfully Purchased!')
        }).catch(err=>{alert('Error!')})
    }


    useEffect(()=>{
        axios
        .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        .then(res=>{
            var temp = [];
            res.data.map((x)=>{
                temp.push({ id: x.id, name: x.name,})
                return temp
            })
            setData(temp)
        })
        axios
        .get('http://localhost:4000/transactions')
        .then(res=>{
            res.data.map((x)=>{
                setWallet(x.wallet)
            })
        })
    },[])

    return(
        <React.Fragment>
            <FormControl className={classes.margin}>
                <InputLabel htmlFor="select">Select a Coin</InputLabel>
                <NativeSelect
                    id="select"
                    value={values}
                    onChange={handleChange}
                    // input={<BootstrapInput />}
                    ><option value="">-</option>
                    {data.map((x)=> (
                        <option key={x.id} value={x.id}>{x.name}</option> 
                    ))}
                </NativeSelect>
            </FormControl>
            <ListItem button onClick={handleClickOpen}>
                <ListItemIcon>
                    <MonetizationOnIcon />
                </ListItemIcon>
                <ListItemText primary="Buy" />
            </ListItem>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title">
                    Buy {values}
                    <div style={{'float': 'right'}}>
                        <IconButton aria-label="close" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    {/* <AttachMoneyIcon style={{"marginTop": "25px"}}/> */}
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
                        <NativeSelect
                        id="select-coin"
                        value={cvals}
                        onChange={handleChange1}
                        >
                            <option value="">-</option>
                            {cdetails.map((x)=> (
                                <option key={x.cid}>{x.cname}</option>
                            ))}
                        </NativeSelect>
                        <Slider
                            defaultValue={30} //the default value is the maximum value 
                            // getAriaValueText= // the coin symbol
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={0}
                            max={10} // the maximum value
                        />
                    </FormControl>
                </DialogContent>
            </Dialog>
            <ListItem button onClick={handleClickOpen2}>
                <ListItemIcon>
                    <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText primary="Transaction History" />
            </ListItem>
            <Dialog onClose={handleClose2} aria-labelledby="customized-dialog-title" open={open2}>
                <DialogTitle id="customized-dialog-title">
                    Transaction History
                    <div style={{'float': 'right'}}>
                        <IconButton aria-label="close" onClick={handleClose2}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </DialogTitle>
                <MaterialTable
                    title=""
                    options={{filtering: false, headerStyle: {backgroundColor: '#f5f5f5'}}}
                    columns={state.columns}
                    data={state.data}
                />
            </Dialog>
            <ListItem button>
                <ListItemIcon>
                    <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary="Track Investment" />
            </ListItem>
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