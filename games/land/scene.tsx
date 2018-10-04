import * as DCL from 'metaverse-api'


export default class SampleScene extends DCL.ScriptableScene {
  async render() {
    return (
      <scene>

        <basic-material
  id="basic_material"
  texture="https://raw.githubusercontent.com/block-base/cryptochronicle/master/games/flappyVoenista/assets/screen.png"
/>
<sphere
  material="#basic_material" position={{ x: 5, y: 3, z: 6 }} rotation={{ x: 180, y: 40, z: 0 }} scale={5}
/>        
      </scene>
     )
  }

}
