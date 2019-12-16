import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable from 'material-table';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import axios from 'axios';

export default function TransList(){
    const [open2, setOpen2] = useState(false);
    const [state, setState] = useState({
        columns: [
            {title: 'Transaction', field: 'transaction'},
            {title: 'Date of Transaction', field: 'time'},
            {title: 'Name of Coin', field: 'currency_name'},
            {title: 'Price of Currency', field: 'currency_price'},
            {title: 'Remaining Coin/s Invested', field: 'r_invested_c'},
            {title: 'Total Coin Invested', field: 'invested_c'},
            {title: 'Total Transaciton', field: 'total_transact'},
            {title: 'Account Money (after Transaction)', field: 'wallet'}
        ]
    })
    const moneyconverter = (x) =>{
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    const handleClickOpen2=()=> {
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
                    r_invested_c: x.available_coin,
                    time: new Date().toLocaleDateString("en-US"),
                    invested_c: x.coin_qty,
                    total_transact: '$'+moneyconverter(Math.round((((x.coin_qty*x.currency_price)*0.10)+(x.coin_qty*x.currency_price))*100)/100),
                    wallet: '$'+moneyconverter(Math.round(x.wallet*100)/100),
                })
                return rdata;
            })
            setState(e => { return {...e, data:rdata} })
        })
    };
    const handleClose2 = () => {
        setOpen2(false);
    };
    return(
        <React.Fragment>
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
        </React.Fragment>
    )
}