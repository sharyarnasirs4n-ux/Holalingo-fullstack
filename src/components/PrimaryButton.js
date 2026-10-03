import { Text,Pressable,StyleSheet } from "react-native";
import { useTheme } from "../Context/ThemeContext";

const PrimaryButton=({onPress,title})=>{

  const {colors,isDark,toggleTheme,}=useTheme()
    const styles=createStyles(colors)

    return (
        <Pressable
        style={({pressed})=>[styles.button,pressed && styles.pressed]} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    )

}
const createStyles=(colors)=>
    StyleSheet.create({
    button:{
        backgroundColor:colors.primary,
        borderRadius:16,
        paddingVertical:17,
        justifyContent:"center",
        alignItems:"center"
    },
    pressed:{
        opacity:0.7,
    },
    text:{
        fontWeight:"800",
        color:colors.white,
        fontSize:16
    }
})




export default PrimaryButton;
