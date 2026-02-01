
let site=null,start=null;
chrome.tabs.onActivated.addListener(async({tabId})=>{
 if(site&&start){
  fetch("http://localhost:5000/api/activity",{
   method:"POST",
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({site,timeSpent:Date.now()-start})
  });
 }
 const tab=await chrome.tabs.get(tabId);
 site=new URL(tab.url).hostname;
 start=Date.now();
});
