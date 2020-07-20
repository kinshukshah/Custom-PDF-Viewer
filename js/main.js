const url='../docs/pdf.pdf';
let pdfDoc=null,
    pageNum=1,
    pageIsRendering=false,
    pageNumisPending=null;

const scale=1.5,
    canvas=document.querySelector("#pdf-render"),
    ctx=canvas.getContext('2d');

const renderPage = num => {
        pageIsRendering = true;
      
        // Get page
        pdfDoc.getPage(num).then(page => {
          // Set scale
          const viewport = page.getViewport({ scale });
          canvas.height = viewport.height;
          canvas.width = viewport.width;
      
          const renderCtx = {
            canvasContext: ctx,
            viewport
          };
      
          page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;
            // kind of when page request is not accepted
            if (pageNumIsPending !== null) {
              renderPage(pageNumIsPending);
              pageNumIsPending = null;
            }
          });
      
          // Output current page
          document.querySelector('#page-num').textContent = num;
        });
      };
      

const queueRenderPage = (num) =>{
    if(pageIsRendering){
        pageNumisPending=num;
    }else{
        renderPage(num);
    }
}


const showPrevPage = () =>{
    if(pageNum<=1){
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
} 



const showNextPage = () =>{
    if(pageNum>=pdfDoc.numPages){
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
} 

pdfjsLib.getDocument(url).promise.then(pdfDoc_ =>{
    pdfDoc=pdfDoc_;
    //console.log(pdfDoc);
    document.querySelector('#page-count').textContent=pdfDoc.numPages;
    renderPage(pageNum);
})
 .catch(err => {
    console.log(err);
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    document.querySelector('.top-bar').style.display = 'none';
  });



document.getElementById('prev-page').addEventListener('click',showPrevPage);
document.getElementById('next-page').addEventListener('click',showNextPage);
