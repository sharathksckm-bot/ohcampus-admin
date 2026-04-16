/* OhCampus Admin - Fix Notification Click & Mark as Read */
(function(){
  'use strict';
  var API = 'https://campusapi.ohcampus.com';
  
  function getToken(){
    try {
      var raw = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if(raw) return raw.replace(/^"|"$/g,'');
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        var v=localStorage.getItem(k);
        if(v&&v.length>50&&v.indexOf('eyJ')===0) return v.replace(/^"|"$/g,'');
      }
    } catch(e){}
    return null;
  }
  
  function fixNotifications(){
    // Find notification items in the panel
    var notifItems = document.querySelectorAll('fuse-vertical-navigation-basic-item[ng-reflect-item], .notification-item, [class*="notification"] .mat-mdc-list-item, mat-list-item');
    
    // Also look for notification panel/sidebar
    var notifPanels = document.querySelectorAll('[class*="notification-panel"], [class*="NotificationPanel"], .cdk-overlay-pane');
    
    notifPanels.forEach(function(panel){
      if(panel.dataset.ohcFixed) return;
      panel.dataset.ohcFixed = 'true';
      
      // Fix click handlers on notification items within the panel
      panel.addEventListener('click', function(e){
        var item = e.target.closest('mat-list-item, .notification-item, [class*="notification-item"]');
        if(item){
          // Extract notification data and navigate
          var titleEl = item.querySelector('h3, .mat-line:first-child, [matline]:first-child, .notification-title');
          var title = titleEl ? titleEl.textContent.trim() : '';
          
          // Try to find a link or ID
          if(title.toLowerCase().indexOf('chat') !== -1 || title.toLowerCase().indexOf('lead') !== -1){
            window.location.hash = '/apps/chatbot-leads';
          }
        }
      });
    });
    
    // Fix "Mark as Read" buttons
    var markReadBtns = document.querySelectorAll('button');
    markReadBtns.forEach(function(btn){
      var text = btn.textContent.trim().toLowerCase();
      if((text.indexOf('mark') !== -1 && text.indexOf('read') !== -1) || text === 'mark all as read'){
        if(btn.dataset.ohcFixed) return;
        btn.dataset.ohcFixed = 'true';
        
        btn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          
          var token = getToken();
          if(!token) return;
          
          fetch(API + '/admin/Common/markAllNotificationsRead', {
            method: 'POST',
            headers: {'Content-Type':'application/json', 'Authorization':'Bearer ' + token},
            body: JSON.stringify({})
          }).then(function(r){ return r.json(); }).then(function(d){
            // Remove notification badge
            var badges = document.querySelectorAll('.mat-badge-content, [matbadge], .notification-badge');
            badges.forEach(function(b){ b.style.display = 'none'; });
            
            // Clear notification list visually
            var items = document.querySelectorAll('mat-list-item, .notification-item');
            items.forEach(function(item){ item.style.opacity = '0.4'; });
            
            console.log('All notifications marked as read');
          }).catch(function(err){ console.error('Mark read error:', err); });
        }, true);
      }
    });
  }
  
  function init(){
    setTimeout(fixNotifications, 3000);
    setTimeout(fixNotifications, 6000);
    setTimeout(fixNotifications, 10000);
  }
  
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Watch for DOM changes (notification panel opening)
  new MutationObserver(function(){
    setTimeout(fixNotifications, 500);
  }).observe(document.body, {childList: true, subtree: true});
})();
