import axios from 'axios'
import { initAdmin } from './admin'
import moment from 'moment';



console.log('hi')

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');
console.log(cartCounter);


function updateCart(product) {
    console.log(product)
    axios.post('/update-cart', product).then(response => {
        console.log(product);
        cartCounter.innerText = response.data.totalQty;
        console.log(response.data.totalQty)

        alert('Item added to cart!')

    }).catch(err => {
        console.log(err);
    })

}
addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let item = JSON.parse(btn.dataset.product);
        updateCart(item);
        // console.log(item);

    })
})

initAdmin();



//change order ststus uit

let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null

let time = document.createElement('small');

function updateStatus(order) {
    //

    let porder = JSON.parse(order)
    
    
    let stepCompleted = true;
    console.log(porder);
    
    statuses.forEach((status) => {
        let dataProp = status.dataset.status;
        if (stepCompleted) {
            status.classList.add('step-completed');
        }
       
        console.log(porder.status)
        console.log(dataProp)
        
        if(dataProp === porder.status){
            stepCompleted = false;
            time.innerText = moment(porder.updatedAt).format('hh:mm A');

            status.appendChild(time);
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current');
            }
                
        }

    })


}

updateStatus(order);