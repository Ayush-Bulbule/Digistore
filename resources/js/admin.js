import moment from 'moment';
import axios from 'axios';

let editBtn = document.querySelectorAll('.btn-edit');
let deleteBtn = document.querySelectorAll('.btn-delete');

export function initAdmin() {

    const orderTableBody = document.querySelector('#orderTableBody');

    let orders = []
    let markup

    axios.get('/admin/panel', {
        headers: {
            'X-Requested-With': "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup
    }).catch(err => {
        console.log("eerro at controller" + err)

    })
}


function renderItems(items) {
    let parserdItems = Object.values(items);
    return parserdItems.map((menuItem) => {
        return `<p>${menuItem.item.name} - ${menuItem.qty}pcs<p>
    `
    }).join('')
}

function generateMarkup(orders) {
    return orders.map(order => {
        return `
    <tr>
        <td class="border px-4 py-2 text-left">
            <p>${order._id}</p>
            <div>${renderItems(order.items)}</div>
        </td>
        <td class="border px-4 py-2 text-left">${order.customerId.name}</td>
        <td class="border px-4 py-2 text-left">${order.address}</td>
        <td class="border px-4 py-2 text-left">
            <form action="/admin/panel/status" method="POST">
                <div class="inline-block relative w-64">
                    <input type="hidden" name="orderId" value="${order._id}" />
                    <select name="status" onChange="this.form.submit()" class="form-select" aria-label="Default select example">
                        <option value="order_placed" ${order.status === 'order_placed' ? 'selected' : ''}>
                            Placed
                        </option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>
                            Confirmed
                        </option>
                        <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>
                            Prepared
                        </option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>
                            Delivered
                        </option>
                        <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>
                            Completed
                        </option>
                    </select>
                </div>
        </form>
        </td>
        <td class="border px-4 py-2 text-left">${moment(order.createdAt).format('hh:mm A')}</td>
    </tr>`
    }).join('')
}

//Cart Delete And Update functionality


deleteBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        let item = JSON.parse(btn.dataset.product);

        // deleteProduct(item);
    })
})

// async function deleteProduct(item) {
//     console.log("Deleted Product - " + item._id);
//     console.log(`/admin/delete/${item._id}`)
//    const result = await axios.delete(`/admin/delete/${item._id}`).then(response => {
//         console.log(response);
//         req.flash('success', 'product deleted successfully');
//     }).catch(error => {
//         console.log(error);
//     })

//     return result;
// }




editBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        let item = JSON.parse(btn.dataset.product);
        updateModal(item);
    })
})

function updateModal(item) {
    console.log(item)
    console.log(item._id)
    document.getElementById('minputname').value = item.name
    document.getElementById('minputdes').value = item.description
    document.getElementById('minputcat').value = item.category
    document.getElementById('minputimg').value = item.image
    document.getElementById('minputrating').value = item.rating
    document.getElementById('minputprice').value = item.price
    document.getElementById('minputstock').value = item.stock
    document.getElementById('modal-form').setAttribute('action', `/admin/updateProcuct/${item._id}`)



    console.log(item)
}
//