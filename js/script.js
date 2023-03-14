let dateData = []
const parentCard = document.getElementById('card-parent');
const loadMoreBtn = document.getElementById('load-more');
const mainUrl = `https://openapi.programming-hero.com/api/ai/tools`;
fetch(mainUrl).then(res => res.json()).then(data => {
  loadData(data);
  loadMoreData(data)
  dateData = data;
  // console.log(data.data.tools);
});

// Dry function show data script -----------------------
const showData = data => {
  data.forEach(element => {

    const { image, name, published_in, features, id } = element;
    // console.log(features);

    const card = document.createElement('div')
    card.innerHTML = `
          <div class="card w-full h-[450px] bg-base-100 shadow-xl">
          <figure><img src="${image}" alt="Shoes" /></figure>
          <div class="card-body">
            <h2 class="card-title text-lg">Features</h2>
            <ol id="features-list" class="list-decimal pl-4">

            ${features ? features.map( featureTitle => `<li> ${featureTitle}</li>` ).join(''): ''}
        </ol>
            <div class="card-actions justify-end border-t py-4 flex justify-between">
              <div class="dateAndTitle">
                  <h2 class="card-title text-xl">${name}</h2>
                  <div class="date"><span class="mr-3"><i class="fa-regular fa-calendar-days"></i></span>${published_in}</div>
              </div>
              <label onclick="modalData('${id}')" for="my-modal-3" class="btn"><i class="fa-solid fa-arrow-right"></i></label>
            </div>
          </div>
        </div>
        `;
    parentCard.appendChild(card);


    document.getElementById('spainer-div').style.display = 'none';
  })

}
// --------------------------------

// Primary load data--------------------
const loadData = data => {
  showData(data.data.tools.slice(0, 6));
}
// ------------------------------------------

// Sort by date-------------------------
const dateSorting = () => {
  loadMoreBtn.style.display = 'block';
  parentCard.innerHTML = '';
  document.getElementById('spainer-div').style.display = 'block';
  let date = dateData.data.tools.sort((a, b) => {
    const d1 = new Date(a.published_in);
    const d2 = new Date(b.published_in);
    if (d1 > d2) return 1;
    else if (d1 < d2) return -1;
    return 0;
  })

  showData(date.slice(0, 6));
}
// dateSorting()
// -------------------------------------------

// Load more button script---------------
const loadMoreData = (data) => {
  loadMoreBtn.addEventListener('click', () => {
    parentCard.innerHTML = '';
    document.getElementById('spainer-div').style.display = 'block';
    // console.log(data);
    showData(data.data.tools)
    loadMoreBtn.style.display = 'none';
  })
}
// ----------------------------------------

// Modal data show---------------------
const modalData = id => {

  fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`).then(res => res.json()).then(data => modalShowData(data))
  const modalShowData = data => {

    const { image_link, accuracy, description, pricing, features, integrations, input_output_examples } = data.data;

    const modalCard = document.getElementById('modal-parent');
    modalCard.innerHTML = `
    <div class="modal-box relative w-11/12 max-w-5xl ">
        <label for="my-modal-3" class="btn btn-sm btn-circle h-14 w-14 absolute right-0 top-0 bg-red-500 text-white">✕</label>
        <div class="md:flex">
            <div class="md:w-1/2 mr-2 p-5 rounded-lg shadow shadow-red-500 bg-red-200 bg-opacity-5 mb-4 md:mb-0">                    
                <h3 class="text-lg font-bold">
                ${description}
                </h3>
                <div class="pricing-card grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div class="bg-white p-5 flex justify-center items-center text-center rounded-lg text-green-700 font-bold">
                      <h3> 
                       ${pricing === null ? 'Free of Cost/' : pricing[0]?.price} Basic
                      </h3>
                    </div>
                    <div class="bg-white p-5 flex justify-center items-center text-center rounded-lg text-orange-500 font-bold">
                    ${pricing === null ? 'Free of Cost/' : pricing[1]?.price} month Pro
                    </div>
                    <div class="bg-white p-5 flex justify-center items-center text-center rounded-lg text-red-600 font-bold">
                        ${pricing === null ? 'Free of Cost/' : pricing[2]?.price}
                    </div>
  
                </div>
                <div class="feature-modal flex justify-between pt-5">
                        <div>
                        <h3 class="text-lg">Features</h3>
                        <ul id="features-ul" class="">

                        </ul>
                        </div>
                        <div>
                        <h3 class="text-lg ">Integrations</h3>
                        <ul id="integrations-list" class="">

                    </ul>
                        </div>
                </div>
                </div>
            <div class="md:w-1/2 text-center text-white rounded-lg shadow shadow-red-100 p-5 ml-2">
                
                <div class="img-box relative">
                    <img class="w-full rounded-lg" src="${image_link[0]}" alt="">
                    <button id="accuracy-btn" class="btn-error bg-red-500 py-1 px-2 rounded-lg text-white absolute right-1 top-1">${accuracy.score ? accuracy.score : 'No'} accuracy</button>
                </div>
            
                <h3 class="text-xl font-bold my-3">${input_output_examples === null ? 'Can you give any example?' : input_output_examples[0].input ? input_output_examples[0].input : 'Can you give any example?'}</h3>
                <p class="text-sm font-light">${input_output_examples === null ? 'No! Not Yet! Take a break!!!' : input_output_examples[0].output ? input_output_examples[0].output : 'No! Not Yet! Take a break!!!'}</p>
            </div>
        </div>
    </div>
  `;
    // Features validation;
    const featureArr = Object.values(features);
    const featureUl = document.getElementById('features-ul');
    featureArr.forEach(e => {
      const li = document.createElement('li');
      li.classList.add('list-disc', 'ml-5', 'text-sm', 'font-light');
      li.innerText = e.feature_name;
      featureUl.appendChild(li);
    });

    const integrationslist = document.getElementById('integrations-list');

    // integrations validation
    integrations ? integrations.forEach(e => {
      const li = document.createElement('li');
      li.classList.add('list-disc', 'ml-5', 'text-sm', 'font-light');
      li.innerText = e;
      integrationslist.appendChild(li);
    }) : 'ok';
    integrations === null ? integrationslist.innerHTML = 'No data Found' : "OKAY";
    features === null ? featureUl.innerHTML = 'No data Found' : "OKAY";
    accuracy.score === null ? document.getElementById('accuracy-btn').style.display = 'none' : 'okay';
  }
}
// -------------------------