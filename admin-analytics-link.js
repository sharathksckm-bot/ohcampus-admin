/* OhCampus Admin - Sidebar Link Injections (Contextual Placement) */
(function(){
  'use strict';
  
  function createLink(id, href, label, iconName, bgFrom, bgTo, borderColor, textColor) {
    var div = document.createElement('div');
    div.id = id;
    div.style.cssText = 'padding:2px 16px;margin:0 0;';
    div.innerHTML = '<a href="' + href + '" target="_blank" style="'
      + 'display:flex;align-items:center;gap:10px;padding:9px 14px;'
      + 'background:linear-gradient(135deg,' + bgFrom + ',' + bgTo + ');'
      + 'border:1px solid ' + borderColor + ';border-radius:10px;'
      + 'color:' + textColor + ';text-decoration:none;font-size:0.82rem;font-weight:600;'
      + 'font-family:Inter,sans-serif;transition:all 0.2s;'
      + '">'
      + '<span class="material-icons" style="font-size:18px;color:' + textColor + '">' + iconName + '</span>'
      + '<span>' + label + '</span>'
      + '<span class="material-icons" style="font-size:14px;margin-left:auto;color:#64748b">open_in_new</span>'
      + '</a>';
    return div;
  }
  
  function findNavItemByText(text) {
    var items = document.querySelectorAll('fuse-vertical-navigation-basic-item, fuse-vertical-navigation-collapsable-item');
    for (var i = 0; i < items.length; i++) {
      var titleEl = items[i].querySelector('.fuse-vertical-navigation-item-title');
      if (titleEl && titleEl.textContent.trim().toLowerCase() === text.toLowerCase()) {
        return items[i];
      }
    }
    return null;
  }
  
  function injectLinks() {
    // 1. College Settings — after "College" nav item
    if (!document.getElementById('ohc-college-settings-link')) {
      var collegeNav = findNavItemByText('College');
      if (collegeNav) {
        var csLink = createLink('ohc-college-settings-link', '/college-settings.html', 'College Settings', 'settings', '#14532d', '#0f172a', '#1e3a5f', '#4ade80');
        collegeNav.parentNode.insertBefore(csLink, collegeNav.nextSibling);
      }
    }
    
    // 2. PYQ Upload — after "Mock Tests" nav item
    if (!document.getElementById('ohc-pyq-upload-link')) {
      var mockTestNav = findNavItemByText('Mock Tests');
      if (mockTestNav) {
        var pyqLink = createLink('ohc-pyq-upload-link', '/pyq-upload.html', 'PYQ / Upload Paper', 'upload_file', '#451a03', '#0f172a', '#92400e', '#fbbf24');
        mockTestNav.parentNode.insertBefore(pyqLink, mockTestNav.nextSibling);
      }
    }
    
    // 3. Mobile Analytics — at the bottom (keep existing behavior)
    if (!document.getElementById('ohc-analytics-link')) {
      var sidebar = document.querySelector('fuse-vertical-navigation-aside-item, fuse-vertical-navigation, [class*="fuse-vertical-navigation"]');
      if (!sidebar) return;
      var navGroups = sidebar.querySelectorAll('fuse-vertical-navigation-group-item');
      var lastGroup = navGroups.length > 0 ? navGroups[navGroups.length - 1] : null;
      
      var analyticsLink = createLink('ohc-analytics-link', '/mobile-analytics.html', 'Mobile Analytics', 'analytics', '#1e3a5f', '#0f172a', '#334155', '#38bdf8');
      analyticsLink.style.cssText = 'padding:8px 16px;margin:4px 12px;';
      
      if (lastGroup) {
        lastGroup.parentNode.insertBefore(analyticsLink, lastGroup.nextSibling);
      } else {
        sidebar.appendChild(analyticsLink);
      }
    }
  }
  
  function init() {
    setTimeout(injectLinks, 2000);
    setTimeout(injectLinks, 4000);
    setTimeout(injectLinks, 7000);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  var lastUrl = location.href;
  new MutationObserver(function() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(injectLinks, 1500);
    }
    if (!document.getElementById('ohc-analytics-link') || !document.getElementById('ohc-college-settings-link')) {
      setTimeout(injectLinks, 1000);
    }
  }).observe(document.body, {childList: true, subtree: true});
})();
