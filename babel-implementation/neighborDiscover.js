// var nmap = require('node-libnmap')

// console.log(nmap)

// nmap.nmap('discover', function(err, report){
//     if (err) throw err
//     console.log(report)
// });

var fs = require('fs');

fs.readFile('/proc/net/arp', function(err, data) {
    console.log(err)
    var output = [];
    var devices = data.toString().split('\n');
    devices.splice(0,1);
console.log(devices)
    for (i = 0; i < devices.length; i++) {
        var cols = devices[i].replace(/ [ ]*/g, ' ').split(' ');

        if ((cols.length > 3) && (cols[0].length !== 0) && (cols[3].length !== 0) && cols[3] !== '00:00:00:00:00:00') {
            output.push({
                ip: cols[0],
                mac: cols[3]
            });
        }
    }

    console.log(output);
});
