import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
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
    const [mprice, setMPrice] = useState();
    const [open, setOpen] = useState(false);
    
    const handleChange=e=>{
        console.log(e.target.value)
        setvalues(e.target.value); //id
        axios
        .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${e.target.value}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
        .then(res=>{
            var temp = []
            res.data.map((x)=>{
                temp.push({ price: x.current_price})
                return temp
            })
            setPrice(...temp)
        })
    };
    const multiply=e=>{
        var num = e.target.value
        var final = price * num
        setMPrice(final)
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    useEffect(()=>{
        axios
        .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        .then(res=>{
            var temp = [];
            res.data.map((x)=>{
                // console.log(x)
                temp.push({ id: x.id, name: x.name,})
                return temp
            })
            setData(temp)
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
                    <DashboardIcon />
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
                    <AttachMoneyIcon style={{"marginTop": "25px"}}/>
                    <TextField
                        id="filled-number"
                        label="USD"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="filled"
                        onChange={multiply}
                    />
                </DialogContent>
                <DialogContent dividers>
                    {mprice}
                </DialogContent>
            </Dialog>
            <ListItem button>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Sell" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Transaction History" />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Track Investment" />
            </ListItem>
        </React.Fragment>
    );
}