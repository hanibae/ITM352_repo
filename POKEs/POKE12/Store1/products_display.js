//define store name and push it to the DOM in the top title
const first_name = "Hani";
const last_name = "Bae";
let full_name="<span style='font-weight: bold; font-size: 600%;'>" + first_name + " " + "</span>" + "<span style='font-style: italic; font-size: 600%;'>" + last_name + "</span>" + "<span style='font-size: 600%;'>" + "'s" + "</span>";
document.getElementById("name").innerHTML=full_name;
top_title.innerHTML = ("Used Smart Phone Store");

//initialize hits, spins, over_half and send to the DOM
let hits=0;
let spins=0;
let over_half=false;
hits_span.innerHTML=hits;
spins_span.innerHTML=spins;

//defining the items, prices, images
let product1 = {
    image: "http://dport96.github.io/ITM352/morea/080.flow-control-II/HTC.jpg",
    brand: "HTC",
    price: 40.00
};

let product2 = {
    image: "http://dport96.github.io/ITM352/morea/080.flow-control-II/iphone-3gs.jpg",
    brand: "Apple",
    price: 75.00
};

let product3 = {
    image: "http://dport96.github.io/ITM352/morea/080.flow-control-II/Nokia.jpg",
    brand: "Nokia",
    price: 35.00
};

let product4 = {
    image: "http://dport96.github.io/ITM352/morea/080.flow-control-II/Samsung.jpg",
    brand: "Samsung",
    price: 45.00
};

let product5 = {
    image: "http://dport96.github.io/ITM352/morea/080.flow-control-II/Blackberry.jpg",
    brand: "Blackberry",
    price: 10.00
};

let products = [product1, product2, product3, product4, product5];


for (let i=0; i<products.length; i++) {
    document.querySelector('.main').innerHTML += `
    <section class="item" onmouseover="changeClassName(this);" onclick="resetClassName(this);">
        <h2>${products[i].brand}</h2>
        <p align="center">$${products[i].price}</p>
        <img src="${products[i].image}" />
        <br>
        <label id="quantity${i}_label" for="quantity${i}">Quantity Desired</label>
        <input type="text" name="quantity${i}" id="quantity${i}" size="5">
    </section>`;
};


//create variables to push to the DOM for current year and time in the footer
const currentYear = new Date().getFullYear();
const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'});

const footerTable = `
    <table border="1" style="margin-left: auto; margin-right: auto; text-align: center;">
        <tr>
            <td></td>
            <td class="table-header"><h1>Your One Stop For Used Phones - ${first_name.charAt(0).toUpperCase()}.${last_name.charAt(0).toUpperCase()}'s</h1></td>
        </tr>
        <tr>
            <td>1.</td>
            <td>Copyright @ ${first_name} ${last_name}</td>
        </tr>
        <tr>
            <td>2.</td>
            <td>${currentYear}</td>
        </tr>
        <tr>
            <td>3.</td>
            <td>${currentTime}</td>
        </tr>
    </table>`;
bottom_title.innerHTML = footerTable;


function changeClassName(element) {
    if(element.className=='item'){
        element.className='item rotate';
        spins=spins+1;
    } 
    if(spins<2*hits&&hits<spins){
        over_half=true;
    }
    win_span.innerHTML = over_half;
    spins_span.innerHTML=spins;
    hit_spin_span.innerHTML=Number(hits/spins).toFixed(2);
};

    // Winning progress depends on hits/spins
    /*let hits_spins_ratio = hits/spins;
    
    if (hits_spins_ratio > 0) {
        if (hits_spins_ratio >= 0.5 && hits < spins) {
            progress = 'You win!';
        } else if (hits_spins_ratio >= 0.25) {
            progress = 'Almost there!';
        } else {
            progress = 'On your way!';
        }
    } else {
        progress = 'Get going!';
    }
    win_span.innerHTML = progress;
}*/

function resetClassName(element) {
    if(element.className=='item rotate'){
        element.className='item';
        hits=hits+=2;
    } else {
        changeClassName(element)
    }
    if(spins<2*hits&&hits<spins){
        over_half=true;
    }
    win_span.innerHTML=over_half;
    hits_span.innerHTML=hits;
    hit_spin_span.innerHTML=Number(hits/spins).toFixed(2);
};



    // Winning progress depends on hits/spins
    /*let hits_spins_ratio = hits/spins;
    
    if (hits_spins_ratio > 0) {
        if (hits_spins_ratio >= 0.5 && hits < spins) {
            progress = 'You win!';
        } else if (hits_spins_ratio >= 0.25) {
            progress = 'Almost there!';
        } else {
            progress = 'On your way!';
        }
    } else {
        progress = 'Get going!';
    }
    win_span.innerHTML = progress;
}*/