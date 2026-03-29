from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Capture console logs
    page.on('console', lambda msg: print(f'[Console] {msg.type}: {msg.text}'))
    
    # Navigate to the frontend
    print('Navigating to http://localhost:3000...')
    page.goto('http://localhost:3000', timeout=30000)
    
    # Wait for the page to load
    print('Waiting for network idle...')
    page.wait_for_load_state('networkidle', timeout=30000)
    
    # Take a screenshot
    print('Taking screenshot...')
    page.screenshot(path='/tmp/dashboard_check.png', full_page=True)
    
    # Get page content
    content = page.content()
    print(f'Page content length: {len(content)}')
    
    # Check for error messages
    error_elements = page.locator('.ant-message-error, .error').all()
    if error_elements:
        print(f'Found {len(error_elements)} error elements')
        for el in error_elements:
            print(f'Error: {el.text_content()}')
    
    # Check for loading state
    loading_elements = page.locator('.ant-spin').all()
    print(f'Found {len(loading_elements)} loading spinners')
    
    # Check the page title
    title = page.title()
    print(f'Page title: {title}')
    
    # Get the visible text
    visible_text = page.locator('body').text_content()
    print(f'Visible text preview (first 500 chars): {visible_text[:500] if visible_text else "None"}')
    
    browser.close()
    print('Test completed!')
