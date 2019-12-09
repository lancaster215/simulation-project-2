import React, { useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Title from './Title';
import axios from 'axios';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Details() {
  const classes = useStyles();
  // const [data, setData] = useState();
  const [price, setPrice] = useState();
  const [time, setTime] = useState();
  const [title, setTitle] = useState();
  const [symbol, setSymbol] = useState();
  const [mcap, setMCap] = useState();
  const [mcapP, setMCapP] = useState();
  const [high, sethigh] = useState();
  const [low, setlow] = useState();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const moneyconverter = (x) =>{
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  useEffect(()=>{
    axios
    .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
    .then(res=>{
      axios
      .get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${res.data[0].id}&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
      .then(res=>{
        // var temp = [];
        res.data.map((x) =>{
          console.log(x)
          // temp.push({ 
          //   symbol: x.symbol, 
          //   name: x.name, 
          //   price: '$'+moneyconverter(x.current_price), 
          //   time: new Date(x.last_updated).toLocaleDateString("en-US") 
          // })
          setSymbol(x.symbol)
          setTitle(x.name)
          setPrice('$'+moneyconverter(x.current_price))
          setTime(new Date(x.last_updated).toLocaleDateString("en-US"))
          setMCap('$'+moneyconverter(x.market_cap))
          setMCapP((Math.round(x.market_cap_change_percentage_24h * 100) / 100)+'%')
          sethigh(x.high_24h)
          setlow(x.low_24h)
          // return temp;
        })
        // setData(...temp)
      })
    })
  }, [])
  // if(mcapP > 0){
  //   color: 'green'
  // }else{
  //   color: 'red'
  // }
  return (
    <React.Fragment>
      <Title>{title} Overview</Title>
      <Typography component="p" variant="h4">
        {/* {console.log(data)} */}
        <div style={{'display': 'flex'}}>{price} <span style={{'fontSize': '20px', 'color': 'green'}}>{mcapP}</span></div>
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {time}
      </Typography>
      <div>
        <Button color="primary" onClick={handleClickOpen}>
          View More Details
        </Button>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title">
            {title} Details
            <div style={{'float': 'right'}}>
              <IconButton aria-label="close" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              <b>Total Current Price:</b>
            </Typography>
            <Typography>
              {price} <b>USD</b> to 1 <b>{symbol}</b>
            </Typography>
            <Typography gutterBottom>
            <b>Market Cap:</b>
            </Typography>
            <Typography>
              {mcap} at <span style={{'color':'green'}}>{mcapP}</span>
            </Typography>
            <Typography gutterBottom>
              <b>24 Hour High / 24 Hour Low</b>
            </Typography>
            <Typography>
              {high} / {low}
            </Typography>
          </DialogContent>
        </Dialog>
      </div>
    </React.Fragment>
  );
}