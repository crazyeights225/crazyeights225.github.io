flags=[{"alias": "O_PATH", "oct": "010000000"},{"alias": "O_SYNC", "oct": "4010000"},{"alias": "O_CLOEXEC", "oct": "02000000"},{"alias": "O_NOATIME", "oct": "01000000"},{"alias": "O_NOFOLLOW", "oct": "00400000"},{"alias": "O_DIRECTORY", "oct": "00200000"},{"alias": "O_LARGEFILE", "oct": "00100000"},{"alias": "O_DIRECT", "oct": "00040000"},{"alias": "FASYNC", "oct": "00020000"},{"alias": "O_DSYNC", "oct": "00010000"},{"alias": "O_NONBLOCK", "oct": "00004000"},{"alias": "O_APPEND", "oct": "00002000"},{"alias": "O_TRUNC", "oct": "00001000"},{"alias": "O_NOCTTY", "oct": "00000400"},{"alias": "O_EXCL", "oct": "00000200"},{"alias": "O_CREAT", "oct": "00000100"},{"alias": "O_RDWR", "oct": "00000002"},{"alias": "O_ACCMODE", "oct": "00000003"},{"alias": "O_WRONLY", "oct": "00000001"},{"alias": "O_RDONLY", "oct": "00000000"}];
function flagIsSet(result,flag){return(result|flag)==result};function hex_to_mask(query){if(query.length===0){return"Please enter a flag"}var idx=document.getElementById("format").selectedIndex;d=0;if(idx==1){d=parseInt(query,16)}if(idx==2){d=parseInt(query)}else{d=parseInt(query,8)}var aliases=[];var alias_str="";if(d==0){alias_str+="<tr><td>"+"00000000"+"</td><td>"+"O_RDONLY"+"</td></tr>";}else{for(let i=0;i<flags.length-1;i++){a=flags[i];a_int=parseInt(a.oct,8);if(flagIsSet(d,a_int)){alias_str+="<tr><td>"+a.oct+"</td><td>"+a.alias+"</td></tr>";d=d^a_int}}}if(alias_str!=""){alias_str="<table>"+alias_str+"</table>"}return alias_str}function callHexToMask(){var query=document.getElementById("in").value;var result=hex_to_mask(query);document.getElementById("out").innerHTML=result}function showTable(){document.getElementById("flags_table").style.display=document.getElementById("flags_table").style.display=="none"?"block":"none"}