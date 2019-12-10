import React, { useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Title from './Title';
import axios from 'axios';

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Details() {
  const classes = useStyles();
  const [data, setData] = useState([]);
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
        var temp = [];
        res.data.map((x) =>{
          temp.push({ 
            symbol: x.symbol, 
            name: x.name, 
            price: '$'+moneyconverter(x.current_price), 
            time: new Date(x.last_updated).toLocaleDateString("en-US"),
            mcap: '$'+moneyconverter(x.market_cap),
            mcapP: (Math.round(x.market_cap_change_percentage_24h * 100) / 100)+'%',
            high: moneyconverter(x.high_24h),
            low: moneyconverter(x.low_24h)
          })
          return temp;
        })
        setData(...temp)
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
      <Title>{data.title} Overview</Title>
      <Typography component="div" variant="h4">
        {/* {console.log(data)} */}
        <div style={{'display': 'flex'}}>{data.price} <span style={{'fontSize': '20px', 'color': 'green'}}>{data.mcapP}</span></div>
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {data.time}
      </Typography>
      <div>
        <Button color="primary" onClick={handleClickOpen}>
          View More Details <ChevronRightIcon fontSize="small"/>
        </Button>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title">
            {data.title} Details
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
              {data.price} <b>USD</b> to 1 <b>{data.symbol}</b>
            </Typography>
            <Typography gutterBottom>
            <b>Market Cap:</b>
            </Typography>
            <Typography>
              {data.mcap} at <span style={{'color':'green'}}>{data.mcapP}</span>
            </Typography>
            <Typography gutterBottom>
              <b>24 Hour High / 24 Hour Low</b>
            </Typography>
            <Typography>
              {data.high} / {data.low}
            </Typography>
          </DialogContent>
        </Dialog>
      </div>
    </React.Fragment>
  );
}