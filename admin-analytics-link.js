/* OhCampus Admin - Mobile Analytics Sidebar Link Injection */
(function(){
  'use strict';
  
  function injectAnalyticsLink(){
    if(document.getElementById('ohc-analytics-link')) return;
    
    // Find sidebar navigation items
    var sidebarLinks = document.querySelectorAll('fuse-vertical-navigation-basic-item, [class*="fuse-vertical-navigation"] a');
    if(sidebarLinks.length === 0) return;
    
    // Try to find the sidebar container (fuse-vertical-navigation)
    var sidebar = document.querySelector('fuse-vertical-navigation-aside-item, fuse-vertical-navigation, [class*="fuse-vertical-navigation"]');
    if(!sidebar) return;
    
    // Find the last nav group or create link near existing items
    var navGroups = sidebar.querySelectorAll('fuse-vertical-navigation-group-item');
    var lastGroup = navGroups.length > 0 ? navGroups[navGroups.length - 1] : null;
    
    // Create the analytics link element
    var linkDiv = document.createElement('div');
    linkDiv.id = 'ohc-analytics-link';
    linkDiv.style.cssText = 'padding:8px 16px;margin:4px 12px;';
    linkDiv.innerHTML = '<a href="/mobile-analytics.html" target="_blank" style="'
      + 'display:flex;align-items:center;gap:10px;padding:10px 14px;'
      + 'background:linear-gradient(135deg,#1e3a5f,#0f172a);'
      + 'border:1px solid #334155;border-radius:10px;'
      + 'color:#38bdf8;text-decoration:none;font-size:0.85rem;font-weight:600;'
      + 'font-family:Inter,sans-serif;transition:all 0.2s;'
      + '">'
      + '<span class="material-icons" style="font-size:20px;color:#38bdf8">analytics</span>'
      + '<span>Mobile Analytics</span>'
      + '<span class="material-icons" style="font-size:16px;margin-left:auto;color:#64748b">open_in_new</span>'
      + '</a>';
    
    // Add hover effect
    var link = linkDiv.querySelector('a');
    link.addEventListener('mouseenter', function(){ this.style.background = 'linear-gradient(135deg,#1d4ed8,#1e3a5f)'; this.style.borderColor = '#38bdf8'; });
    link.addEventListener('mouseleave', function(){ this.style.background = 'linear-gradient(135deg,#1e3a5f,#0f172a)'; this.style.borderColor = '#334155'; });
    
    if(lastGroup){
      lastGroup.parentNode.insertBefore(linkDiv, lastGroup.nextSibling);
    } else {
      sidebar.appendChild(linkDiv);
    }
    
    // College Settings link
    if(!document.getElementById('ohc-college-settings-link')){
      var csDiv = document.createElement('div');
      csDiv.id = 'ohc-college-settings-link';
      csDiv.style.cssText = 'padding:4px 16px;margin:0 12px;';
      csDiv.innerHTML = '<a href="/college-settings.html" target="_blank" style="'
        + 'display:flex;align-items:center;gap:10px;padding:10px 14px;'
        + 'background:linear-gradient(135deg,#14532d,#0f172a);'
        + 'border:1px solid #1e3a5f;border-radius:10px;'
        + 'color:#4ade80;text-decoration:none;font-size:0.85rem;font-weight:600;'
        + 'font-family:Inter,sans-serif;transition:all 0.2s;">'
        + '<span class="material-icons" style="font-size:20px;color:#4ade80">settings</span>'
        + '<span>College Settings</span>'
        + '<span class="material-icons" style="font-size:16px;margin-left:auto;color:#64748b">open_in_new</span>'
        + '</a>';
      linkDiv.parentNode.insertBefore(csDiv, linkDiv.nextSibling);
    }
  }
  
  function init(){
    setTimeout(injectAnalyticsLink, 2000);
    setTimeout(injectAnalyticsLink, 4000);
    setTimeout(injectAnalyticsLink, 7000);
  }
  
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Watch for SPA navigation
  var lastUrl = location.href;
  new MutationObserver(function(){
    if(location.href !== lastUrl){
      lastUrl = location.href;
      setTimeout(injectAnalyticsLink, 1500);
    }
    // Re-inject if sidebar was rebuilt
    if(!document.getElementById('ohc-analytics-link')){
      setTimeout(injectAnalyticsLink, 1000);
    }
  }).observe(document.body, {childList: true, subtree: true});
})();
