const resultslist = document.getElementById("results-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searching = document.getElementById("searching-spin");
searching.style.display = "none";
// const APIdata = {
//   artists: [
//     {
//       name: "Orelsan",
//       id: "4FpJcNgOvIpSBeJgRg3OfN",
//       genre: "french hip hop, old school rap francais, rap conscient",
//       followers: 2328170,
//       popularity: 65,
//       uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//       cover: "https://i.scdn.co/image/ab6761610000e5eb32086a424e6f1e499e347cde",
//     },
//   ],
//   tracks: [
//     {
//       name: "La Quête",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//       id: "0w6lsLBvhtGcqMYA7MB7r6",
//       type: "track",
//       uri: "https://open.spotify.com/track/0w6lsLBvhtGcqMYA7MB7r6",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 244000,
//       album: {
//         id: "2o2GBOfy2GG9oKYZgfZkur",
//         uri: "https://open.spotify.com/album/2o2GBOfy2GG9oKYZgfZkur",
//         name: "Civilisation",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2021-11-19",
//         year: "2021",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/c5fa01be60a985706241755c7ace13255e863c43?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 2,
//     },
//     {
//       name: "La pluie (feat. Stromae)",
//       artist: "Orelsan / Stromae",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//       id: "4cYFep5SECqb4EsSkF82e0",
//       type: "track",
//       uri: "https://open.spotify.com/track/4cYFep5SECqb4EsSkF82e0",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//         {
//           name: "Stromae",
//           uri: "https://open.spotify.com/artist/5j4HeCoUlzhfWtjAfM1acR",
//         },
//       ],
//       duration_ms: 175346,
//       album: {
//         id: "04mHlwou1RaPDo8SigFfKf",
//         uri: "https://open.spotify.com/album/04mHlwou1RaPDo8SigFfKf",
//         name: "La fête est finie",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2017-10-20",
//         year: "2017",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/0deb95328892c70f2811681ea30718fa282c9dab?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 12,
//     },
//     {
//       name: "Basique",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//       id: "2ICdvchXmDh5mdLyyL2opB",
//       type: "track",
//       uri: "https://open.spotify.com/track/2ICdvchXmDh5mdLyyL2opB",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 163986,
//       album: {
//         id: "04mHlwou1RaPDo8SigFfKf",
//         uri: "https://open.spotify.com/album/04mHlwou1RaPDo8SigFfKf",
//         name: "La fête est finie",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2017-10-20",
//         year: "2017",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/921afbdc8aceba20887e7d9574820259dddb3fb7?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 3,
//     },
//     {
//       name: "CP_009_ Évidemment",
//       artist: "Orelsan / Angèle",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b2732724364cd86bb791926b6cc8",
//       id: "6btgTbK2UslfSu0qjTEXQm",
//       type: "track",
//       uri: "https://open.spotify.com/track/6btgTbK2UslfSu0qjTEXQm",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//         {
//           name: "Angèle",
//           uri: "https://open.spotify.com/artist/3QVolfxko2UyCOtexhVTli",
//         },
//       ],
//       duration_ms: 206272,
//       album: {
//         id: "68YP0pEgwhnfRqQAzu71gP",
//         uri: "https://open.spotify.com/album/68YP0pEgwhnfRqQAzu71gP",
//         name: "Civilisation Edition Ultime",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b2732724364cd86bb791926b6cc8",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2022-10-28",
//         year: "2022",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/7ac8c656a45b50ddb366879772bc2a2493565ea1?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 9,
//     },
//     {
//       name: "Jour meilleur",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//       id: "6VOUfCrjmxH62oijWgbC6O",
//       type: "track",
//       uri: "https://open.spotify.com/track/6VOUfCrjmxH62oijWgbC6O",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 181111,
//       album: {
//         id: "2o2GBOfy2GG9oKYZgfZkur",
//         uri: "https://open.spotify.com/album/2o2GBOfy2GG9oKYZgfZkur",
//         name: "Civilisation",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2021-11-19",
//         year: "2021",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/22a75478c2921df4608f23490047d408ed5795a8?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 9,
//     },
//     {
//       name: "La terre est ronde",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b27342a91184c215f8a95b5f77ec",
//       id: "3IM7zXywZ6sRTtkRjRLxJ8",
//       type: "track",
//       uri: "https://open.spotify.com/track/3IM7zXywZ6sRTtkRjRLxJ8",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 219865,
//       album: {
//         id: "5GfsaNstrK8rszTX5XYtXU",
//         uri: "https://open.spotify.com/album/5GfsaNstrK8rszTX5XYtXU",
//         name: "Le chant des sirènes",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b27342a91184c215f8a95b5f77ec",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2011-09-26",
//         year: "2011",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/15cb3f002a5b5de7f6572bb6b1d845247b87e677?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 10,
//     },
//     {
//       name: "Du propre",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//       id: "17gkoi8EGPO1XssTOYK5ki",
//       type: "track",
//       uri: "https://open.spotify.com/track/17gkoi8EGPO1XssTOYK5ki",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 227040,
//       album: {
//         id: "2o2GBOfy2GG9oKYZgfZkur",
//         uri: "https://open.spotify.com/album/2o2GBOfy2GG9oKYZgfZkur",
//         name: "Civilisation",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2021-11-19",
//         year: "2021",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/450e0fe4446d5bfd3427b6fb59ac3f5f651534e1?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 3,
//     },
//     {
//       name: "Notes pour trop tard (feat. Ibeyi)",
//       artist: "Orelsan / Ibeyi",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//       id: "3SgnYOV9ONL0bIHaAcOYE1",
//       type: "track",
//       uri: "https://open.spotify.com/track/3SgnYOV9ONL0bIHaAcOYE1",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//         {
//           name: "Ibeyi",
//           uri: "https://open.spotify.com/artist/5Q8NEHGX70m1kkojbtm8wa",
//         },
//       ],
//       duration_ms: 454533,
//       album: {
//         id: "04mHlwou1RaPDo8SigFfKf",
//         uri: "https://open.spotify.com/album/04mHlwou1RaPDo8SigFfKf",
//         name: "La fête est finie",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2017-10-20",
//         year: "2017",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/85d1f16a96bf17a5ce87e878e7f400ed9d1066cf?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 14,
//     },
//     {
//       name: "Paradis",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//       id: "3qWNgvQTzSbA67Z4r0mX9O",
//       type: "track",
//       uri: "https://open.spotify.com/track/3qWNgvQTzSbA67Z4r0mX9O",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 229626,
//       album: {
//         id: "04mHlwou1RaPDo8SigFfKf",
//         uri: "https://open.spotify.com/album/04mHlwou1RaPDo8SigFfKf",
//         name: "La fête est finie",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2017-10-20",
//         year: "2017",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/81b69c8f992f556939983f6cf4c8eb52bcb0244d?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 13,
//     },
//     {
//       name: "Défaite de famille",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//       id: "0IvTKTST66tq30ZeFWeqfm",
//       type: "track",
//       uri: "https://open.spotify.com/track/0IvTKTST66tq30ZeFWeqfm",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 223146,
//       album: {
//         id: "04mHlwou1RaPDo8SigFfKf",
//         uri: "https://open.spotify.com/album/04mHlwou1RaPDo8SigFfKf",
//         name: "La fête est finie",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2017-10-20",
//         year: "2017",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/35395e0a08a20d411147e6467e23a3041df37354?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 5,
//     },
//     {
//       name: "Rêves bizarres (feat. Damso)",
//       artist: "Orelsan / Damso",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b2733331ab0675406c3c6d711c25",
//       id: "7lhuM9WUqdThw72dCBRmQW",
//       type: "track",
//       uri: "https://open.spotify.com/track/7lhuM9WUqdThw72dCBRmQW",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//         {
//           name: "Damso",
//           uri: "https://open.spotify.com/artist/2UwqpfQtNuhBwviIC0f2ie",
//         },
//       ],
//       duration_ms: 212608,
//       album: {
//         id: "5nyLaTsztHW8mI1KAWeGkS",
//         uri: "https://open.spotify.com/album/5nyLaTsztHW8mI1KAWeGkS",
//         name: "La fête est finie - EPILOGUE",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b2733331ab0675406c3c6d711c25",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2018-11-16",
//         year: "2018",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/d390b9e62c821f9ec4bc583543a39aef7439ca0d?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 10,
//     },
//     {
//       name: "San",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//       id: "36SHbxigbf4iSCHdQVgy6V",
//       type: "track",
//       uri: "https://open.spotify.com/track/36SHbxigbf4iSCHdQVgy6V",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 242333,
//       album: {
//         id: "04mHlwou1RaPDo8SigFfKf",
//         uri: "https://open.spotify.com/album/04mHlwou1RaPDo8SigFfKf",
//         name: "La fête est finie",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2017-10-20",
//         year: "2017",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/943694be6c39c10a280e6bfbd7d652e039550426?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 1,
//     },
//     {
//       name: "Athéna",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//       id: "4OTgPQji476VR0qarMgsgG",
//       type: "track",
//       uri: "https://open.spotify.com/track/4OTgPQji476VR0qarMgsgG",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 172047,
//       album: {
//         id: "2o2GBOfy2GG9oKYZgfZkur",
//         uri: "https://open.spotify.com/album/2o2GBOfy2GG9oKYZgfZkur",
//         name: "Civilisation",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2021-11-19",
//         year: "2021",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/26bb2b87e40e37e5a744bfc82842ff872e065092?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 14,
//     },
//     {
//       name: "L'odeur de l'essence",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//       id: "4c3TC1eWvz6BgOqSlOAKdT",
//       type: "track",
//       uri: "https://open.spotify.com/track/4c3TC1eWvz6BgOqSlOAKdT",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 282475,
//       album: {
//         id: "2o2GBOfy2GG9oKYZgfZkur",
//         uri: "https://open.spotify.com/album/2o2GBOfy2GG9oKYZgfZkur",
//         name: "Civilisation",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2021-11-19",
//         year: "2021",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/0adc2629e801db48b7460d8aed957a59f03e3051?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 8,
//     },
//     {
//       name: "Tout va bien",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//       id: "7gmYDrNYV5AaTEnZo0yhtM",
//       type: "track",
//       uri: "https://open.spotify.com/track/7gmYDrNYV5AaTEnZo0yhtM",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 149053,
//       album: {
//         id: "04mHlwou1RaPDo8SigFfKf",
//         uri: "https://open.spotify.com/album/04mHlwou1RaPDo8SigFfKf",
//         name: "La fête est finie",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2017-10-20",
//         year: "2017",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/5f79c29f4c32a43fa891e8a8bf4502f80ba0d48d?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 4,
//     },
//     {
//       name: "Christophe (feat. Maître Gims)",
//       artist: "Orelsan / GIMS",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//       id: "0VhkA3NAwIFfVW4NFCbAOD",
//       type: "track",
//       uri: "https://open.spotify.com/track/0VhkA3NAwIFfVW4NFCbAOD",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//         {
//           name: "GIMS",
//           uri: "https://open.spotify.com/artist/0GOx72r5AAEKRGQFn3xqXK",
//         },
//       ],
//       duration_ms: 166493,
//       album: {
//         id: "04mHlwou1RaPDo8SigFfKf",
//         uri: "https://open.spotify.com/album/04mHlwou1RaPDo8SigFfKf",
//         name: "La fête est finie",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b273b8443d0a4f57b844ab1e0e39",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2017-10-20",
//         year: "2017",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/ebf41da22a6216afcc264df45574db2b6831d4e1?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 9,
//     },
//     {
//       name: "Pour Le Pire",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b2730b2e3999b189fa2a8a6a752f",
//       id: "4UVDKEPTgMQXv9UlIqVTcA",
//       type: "track",
//       uri: "https://open.spotify.com/track/4UVDKEPTgMQXv9UlIqVTcA",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 214400,
//       album: {
//         id: "17UiqpQyl8T8vVxz2Towjy",
//         uri: "https://open.spotify.com/album/17UiqpQyl8T8vVxz2Towjy",
//         name: "Perdu D'Avance",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b2730b2e3999b189fa2a8a6a752f",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2009-02-16",
//         year: "2009",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/c401008dd59baab3b5724b24f609053b0b29d69e?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 6,
//     },
//     {
//       name: "OrelSan - Mashup",
//       artist: "Trinix Remix",
//       album_artist: "Trinix Remix",
//       cover: "https://i.scdn.co/image/ab67616d0000b27339e74975a9efa7a0cfb62d30",
//       id: "1PHoKn7jBJT7ABxyFoHdMf",
//       type: "track",
//       uri: "https://open.spotify.com/track/1PHoKn7jBJT7ABxyFoHdMf",
//       artists: [
//         {
//           name: "Trinix Remix",
//           uri: "https://open.spotify.com/artist/0RvjLz7klSc5lNgxX7EiVZ",
//         },
//       ],
//       duration_ms: 150340,
//       album: {
//         id: "7aJPmS3TRn3wR1gGpYNzrt",
//         uri: "https://open.spotify.com/album/7aJPmS3TRn3wR1gGpYNzrt",
//         name: "OrelSan (Mashup)",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b27339e74975a9efa7a0cfb62d30",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2022-01-21",
//         year: "2022",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/6dfb451b0cced7efacf69f38a402c8cea0a0350c?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 1,
//     },
//     {
//       name: "Seul avec du monde autour",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//       id: "3thFDKQiVTO3zpjppG91BE",
//       type: "track",
//       uri: "https://open.spotify.com/track/3thFDKQiVTO3zpjppG91BE",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 208594,
//       album: {
//         id: "2o2GBOfy2GG9oKYZgfZkur",
//         uri: "https://open.spotify.com/album/2o2GBOfy2GG9oKYZgfZkur",
//         name: "Civilisation",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b27358ba1ea637001f9a15e55a92",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2021-11-19",
//         year: "2021",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/2cbaf3560d536962fb6825b460c9dd894370089f?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 6,
//     },
//     {
//       name: "Suicide social",
//       artist: "Orelsan",
//       album_artist: "Orelsan",
//       cover: "https://i.scdn.co/image/ab67616d0000b27342a91184c215f8a95b5f77ec",
//       id: "5IZGqvPLERJ4BOHAmLrRoy",
//       type: "track",
//       uri: "https://open.spotify.com/track/5IZGqvPLERJ4BOHAmLrRoy",
//       artists: [
//         {
//           name: "Orelsan",
//           uri: "https://open.spotify.com/artist/4FpJcNgOvIpSBeJgRg3OfN",
//         },
//       ],
//       duration_ms: 341865,
//       album: {
//         id: "5GfsaNstrK8rszTX5XYtXU",
//         uri: "https://open.spotify.com/album/5GfsaNstrK8rszTX5XYtXU",
//         name: "Le chant des sirènes",
//         image: {
//           url: "https://i.scdn.co/image/ab67616d0000b27342a91184c215f8a95b5f77ec",
//           height: 640,
//           width: 640,
//         },
//         release_date: "2011-09-26",
//         year: "2011",
//       },
//       preview_url:
//         "https://p.scdn.co/mp3-preview/4574e4a74e5250a97faa833a5f9c6d8fff6d90af?cid=e4ff2b7ee2c54419a2245947613c959a",
//       track_position: 15,
//     },
//   ],
// };

var data = [];
// data.push({
//   type: "artist",
//   ...APIdata.artists[0],
// });
// APIdata.tracks.forEach((track) => {
//   data.push({
//     type: "track",
//     ...track,
//   });
// });

searchButton.onclick = search;
// searchInput.enterKeyHint = search;

async function search(){
    const query = searchInput.value;

    if (query.length < 2) {
        return;
    }

    showSearching();

    const response = await fetch(`http://192.168.0.50:5000/api/search/${query}?type=track,artist&limit=40`);
    const result = await response.json();

    data = [];
    data.push({
        type: "artist",
        ...result.artists[0],
    });

    result.tracks.forEach((track) => {
        data.push({
            type: "track",
            ...track,
        });
    });

    refreshResults();

    hideSearching();
}

async function artistClick(artist_id) {
  console.log("clicked on artist", artist_id);

  const result = await fetch(`http://192.168.0.50:5000/api/artist/${artist_id}`);
    const dt = await result.json();
    console.log(dt);
    data = [];
    dt.tracks.forEach((track) => {  
        data.push({
            type: "track",
            ...track,
        });
        }
    );
    console.log(data);
    
    refreshResults();
}

function trackDownloadClick(track_id) {
  console.log("clicked on download", track_id);
}


function hideSearching() {
    searching.style.display = "none";
}

function showSearching() {
    searching.style.display = "";
}


function addSearchResult(type = "track", data) {
  const searchResult = document.createElement("div");
  searchResult.id = data.id;
  // class= flex items-center space-x-2 border-b pb-2 pt-2 pointer
  searchResult.classList.add(
    "flex",
    "items-center",
    "space-x-2",
    "border-b",
    "pb-2",
    "pt-2",
    type == "artist" ? "pointer" : "nopointer"
  );


  const img = document.createElement("img");
  img.src = data.cover;
  img.alt = data.name;
  img.width = 48;
  img.height = 48;

  roundedClass = type == "artist" ? "rounded-full" : "rounded-md";
  img.classList.add("w-12", "h-12", roundedClass);
  img.loading = "lazy";
  img.decoding = "async";

  searchResult.appendChild(img);

  if (type == "artist") {
    searchResult.innerHTML += `
    <div class="flex-grow">
        <h3 class="font-semibold">${data.name}</h3>
    </div>
    <i class="icon chevron-right"></i>
    `;

    searchResult.onclick = () => {
      artistClick(data.id);
    };
  } else if (type == "track") {
    searchResult.innerHTML += `
    <div class="flex-grow">
        <h3 class="font-semibold">${data.name}</h3>
        <p class="text-gray-400">${data.artist}</p>
    </div>
    <button class="text-blue-500 border border-blue-500 px-2 py-1 rounded hover:bg-blue-500 hover:text-white" id="download-${data.id}">
        <i class="icon download"></i>
    </button>
    `;
  }

  resultslist.appendChild(searchResult);

  if (type == "track") {
    document.getElementById(`download-${data.id}`).onclick = () => {
      trackDownloadClick(data.id);
    };
  }
}

function refreshResults() {
  resultslist.innerHTML = "";
  data.forEach((result) => {
    if (result.type == "artist") {
      addSearchResult("artist", result);
    } else if (result.type == "track") {
      addSearchResult("track", result);
    }
  });
  //   if (data.artists.length > 0) {
  //     addSearchResult("artist", data.artists[0]);
  //   }
  //   for (let i = 0; i < data.tracks.length; i++) {
  //     addSearchResult("track", data.tracks[i]);
  //   }
}
refreshResults();
