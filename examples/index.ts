export function run() {
    let l = window.location;
    let path = `${l.origin}${l.pathname}?run=examples/`;
    let labs = `
    ags-discovery
    ags-webmap
    layerswitcher
    accessibility

    index
    `;
    
    document.writeln(`
    <a href="tests.html">Tests</a>
    <p>
    Watch the console output for failed assertions (blank is good).
    </p>
    `);

    document.writeln(labs
        .split(/ /)
        .map(v => v.trim())
        .filter(v => !!v)
        .sort()
        .map(lab => `<a href=${path}${lab}&debug=1>${lab}</a>`)
        .join("<br/>"));
    
};
