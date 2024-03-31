// contentScript.js

// Function to create and append HTML elements
function createSidebar() {
    // Find the div.celwidget element
    const celwidget = document.querySelector('div.celwidget');

    // Get the dimensions of the div.celwidget element
    const celwidgetRect = celwidget.getBoundingClientRect();

    // Set the offset values (adjust as needed)
    const offsetTop = 5; // Adjust the top offset value as needed
    const offsetRight = 20; // Adjust the right offset value as needed

    // Create a sidebar container
    const sidebar = document.createElement('div');
    sidebar.id = 'amazonSidebar';
    sidebar.style.position = 'absolute';
    sidebar.style.top = `${celwidgetRect.bottom + offsetTop}px`; // Position below div.celwidget with offset
    sidebar.style.right = `${offsetRight}px`; // Set the offset from the right edge
    sidebar.style.backgroundColor = '#ffffff';
    sidebar.style.display = 'flex';
    sidebar.style.alignItems = 'center';
    sidebar.style.justifyContent = 'flex-end';

    // Define the different Amazon fronts and their hostnames with country flags
    const amazonFronts = [
        { name: '🇨🇦 CA', hostname: 'www.amazon.ca' },
        { name: '🇯🇵 CO.JP', hostname: 'www.amazon.co.jp' },
        { name: '🇬🇧 CO.UK', hostname: 'www.amazon.co.uk' },
        { name: '🇺🇸 COM', hostname: 'www.amazon.com' },
        { name: '🇦🇺 COM.AU', hostname: 'www.amazon.com.au' },
        { name: '🇧🇷 COM.BR', hostname: 'www.amazon.com.br' },
        { name: '🇲🇽 COM.MX', hostname: 'www.amazon.com.mx' },
        { name: '🇩🇪 DE', hostname: 'www.amazon.de' },
        { name: '🇪🇸 ES', hostname: 'www.amazon.es' },
        { name: '🇫🇷 FR', hostname: 'www.amazon.fr' },
        { name: '🇮🇳 IN', hostname: 'www.amazon.in' },
        { name: '🇮🇹 IT', hostname: 'www.amazon.it' },
        { name: '🇳🇱 NL', hostname: 'www.amazon.nl' },
        { name: '🇸🇪 SE', hostname: 'www.amazon.se' },
        { name: '🇸🇬 SG', hostname: 'www.amazon.sg' }
    ];

    // Create the dropdown menu
    const dropdown = document.createElement('select');
    dropdown.style.padding = '4px';
    dropdown.style.marginRight = '1px';

    // Create options for each Amazon front
    amazonFronts.forEach(front => {
        const option = document.createElement('option');
        option.textContent = front.name;
        option.value = front.hostname;
        dropdown.appendChild(option);
    });

    // Create the button element
    const button = document.createElement('button');
    button.textContent = '>';
    button.title = 'Go to Other Amazon Front';
    button.style.padding = '4px 6px'; // Adjust padding to reduce height
    button.style.fontSize = '14px'; // Adjust font size to reduce height
    button.style.cursor = 'pointer';

    // Event listener for the button click
    button.addEventListener('click', () => {
        const selectedHostname = dropdown.options[dropdown.selectedIndex].value;
        const asin = window.location.href.match(/\/dp\/([A-Z0-9]{10})/)[1];
        const redirectUrl = `https://${selectedHostname}/dp/${asin}/`;
        window.location.href = redirectUrl;
    });

    // Append elements to the sidebar
    sidebar.appendChild(dropdown);
    sidebar.appendChild(button);

    // Append the sidebar after the div.celwidget element
    document.body.appendChild(sidebar);
}

// Call the function to create the sidebar
createSidebar();
