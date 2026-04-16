/* OhCampus Admin - Sidebar Link Injections (Inside Submenus) */
(function(){
  'use strict';
  
  function createSubItem(id, href, label) {
    var item = document.createElement('div');
    item.id = id;
    item.style.cssText = 'padding-left:0;';
    item.innerHTML = '<div class="fuse-vertical-navigation-item-wrapper">'
      + '<a href="' + href + '" target="_blank" class="fuse-vertical-navigation-item" style="'
      + 'display:flex;align-items:center;padding:10px 16px 10px 56px;'
      + 'color:currentColor;text-decoration:none;font-size:13px;'
      + 'transition:background 0.2s;cursor:pointer;'
      + '">'
      + '<span class="fuse-vertical-navigation-item-title" style="font-size:13px">' + label + '</span>'
      + '<span style="margin-left:auto;font-size:10px;color:#94a3b8;opacity:0.6">&#8599;</span>'
      + '</a></div>';
    
    // Hover effect
    var link = item.querySelector('a');
    link.addEventListener('mouseenter', function(){ this.style.background = 'rgba(0,0,0,0.04)'; });
    link.addEventListener('mouseleave', function(){ this.style.background = ''; });
    
    return item;
  }
  
  function findCollapsableByTitle(text) {
    var items = document.querySelectorAll('fuse-vertical-navigation-collapsable-item');
    for (var i = 0; i < items.length; i++) {
      var titleEl = items[i].querySelector('.fuse-vertical-navigation-item-title');
      if (titleEl && titleEl.textContent.trim() === text) {
        return items[i];
      }
    }
    return null;
  }
  
  function getChildrenContainer(collapsable) {
    // Children may be in a wrapper div or direct
    var wrapper = collapsable.querySelector('.fuse-vertical-navigation-item-children, div[class*="children"]');
    if (wrapper) {
      var basics = wrapper.querySelectorAll('fuse-vertical-navigation-basic-item');
      return basics.length > 0 ? basics[basics.length - 1] : wrapper;
    }
    // Fallback: direct children
    var basics = collapsable.querySelectorAll('fuse-vertical-navigation-basic-item');
    return basics.length > 0 ? basics[basics.length - 1] : null;
  }
  
  function injectLinks() {
    // 1. PYQ / Upload Paper — as 4th sub-item under Mock Tests
    if (!document.getElementById('ohc-pyq-submenu')) {
      var mockTests = findCollapsableByTitle('Mock Tests');
      if (mockTests) {
        var lastChild = getChildrenContainer(mockTests);
        if (lastChild) {
          var pyqItem = createSubItem('ohc-pyq-submenu', '/pyq-upload.html', 'PYQ / Upload Paper');
          lastChild.parentNode.insertBefore(pyqItem, lastChild.nextSibling);
        }
      }
    }
    
    // 2. College Settings — as 8th sub-item under College (after Reviews which is 7th)
    if (!document.getElementById('ohc-college-settings-submenu')) {
      var college = findCollapsableByTitle('College');
      if (college) {
        var lastCollegeChild = getChildrenContainer(college);
        if (lastCollegeChild) {
          var csItem = createSubItem('ohc-college-settings-submenu', '/college-settings.html', 'College Settings');
          lastCollegeChild.parentNode.insertBefore(csItem, lastCollegeChild.nextSibling);
        }
      }
    }
    
    // 3. Mobile Analytics — at the bottom of sidebar
    if (!document.getElementById('ohc-analytics-link')) {
      var sidebar = document.querySelector('fuse-vertical-navigation-aside-item, fuse-vertical-navigation, [class*="fuse-vertical-navigation"]');
      if (!sidebar) return;
      var navGroups = sidebar.querySelectorAll('fuse-vertical-navigation-group-item');
      var lastGroup = navGroups.length > 0 ? navGroups[navGroups.length - 1] : null;
      
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
      
      if (lastGroup) {
        lastGroup.parentNode.insertBefore(linkDiv, lastGroup.nextSibling);
      } else {
        sidebar.appendChild(linkDiv);
      }
    }
    
    // Remove old standalone links if they exist
    var oldCS = document.getElementById('ohc-college-settings-link');
    if (oldCS) oldCS.remove();
    var oldPYQ = document.getElementById('ohc-pyq-upload-link');
    if (oldPYQ) oldPYQ.remove();
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
    if (!document.getElementById('ohc-pyq-submenu') || !document.getElementById('ohc-college-settings-submenu')) {
      setTimeout(injectLinks, 1000);
    }
  }).observe(document.body, {childList: true, subtree: true});
})();
