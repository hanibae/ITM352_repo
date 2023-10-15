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
let name1 = "HTC";
let price1 = 40.00;
let image1 = "http://dport96.github.io/ITM352/morea/080.flow-control-II/HTC.jpg";

let name2 = "Apple";
let price2 = 75.00;
let image2 = "http://dport96.github.io/ITM352/morea/080.flow-control-II/iphone-3gs.jpg";

let name3 = "Nokia";
let price3 = 35.00;
let image3 = "http://dport96.github.io/ITM352/morea/080.flow-control-II/Nokia.jpg";

let name4 = "Samsung";
let price4 = 45.00;
let image4 = "http://dport96.github.io/ITM352/morea/080.flow-control-II/Samsung.jpg";

let name5 = "Blackberry";
let price5 = 10.00;
let image5 = "http://dport96.github.io/ITM352/morea/080.flow-control-II/Blackberry.jpg";


for (let i=1; eval("typeof name"+i) != 'undefined'; i++){
    document.querySelector('.main').innerHTML += `
    <section class="item" onmouseover="changeClassName(this);" onclick="resetClassName(this);">
        <h2>${eval("name"+i)}</h2>
        <p>$${eval("price"+i)}</p>
        <img src="${eval("image"+i)}" />
    </section>`;
}


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