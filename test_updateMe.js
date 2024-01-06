
//let i = 300
//while (i){
//    updateVersion("./manifest.json")
//    i -= 1
//}
                //  mask edit
//                "x.1.x" => "will only replace the minor version to 1"
//                "x.x.10" => "will only replace the patch version to 10"
//                "2.x.x" => "will only replace the major version to 2"
//                "2.2.x" => "will replace major and minor - patch will stay whatever it is"
//                "1.+1.x" => "will replace major to 1, increment the current minor by 1 and - patch will stay whatever it is"
//                "1.+1.x" => "will replace major to 1, increment the current minor by 1 and - patch will stay whatever it is"
            //     +x.+1.x" => will ONLY increase the minor - +x does nothing   

console.log(maskVersion("0.2.15", "+x.+1.x"));    // Output: "0.1.15"
console.log(maskVersion("0.2.15", "x.x.10"));   // Output: "0.2.10"
console.log(maskVersion("0.2.15", "2.x.x"));   // Output: "2.2.15"
console.log(maskVersion("0.2.15", "2.2.x"));   // Output: "2.2.15"
console.log(maskVersion("0.2.15", "1.+1.x"));  // Output: "1.3.15"
console.log(maskVersion("0.2.15", "1.+1.+10")); // Output: "1.3.10"

/*
node updateMe.js ./manifestmv3.json --bump patch                       
node updateMe.js ./manifestmv3.json --bump pa                          
node updateMe.js ./manifestmv3.json --bump minor                       
node updateMe.js ./manifestmv3.json --bump mino                        
node updateMe.js ./manifestmv3.json --bump x.x3                        
node updateMe.js ./manifestmv3.json --x x.x3                           
node updateMe.js ./manifestmv3.json --x x.x.+3                         
node updateMe.js ./manifestmv3.json --x x.x.3                          
node updateMe.js ./manifestmv3.json --x asdsda                         
node updateMe.js manifestmv3.json --x asdsda                           
node updateMe.js manifestmv3.json --x lkj                              
node updateMe.js manifestmv3.json --x
*/