import sys
import re

def main():
    args = sys.argv
    if 2 != len(args):
        print("Give me a component name as an argument!!!")
        return

    name = args[1].capitalize()
    path_w = "./src/auth/" + args[1] + ".tsx"

    hook_part = """
  const [{}, set{}] = useState(initialState);
  const navigation = useContext(NavigationContext);

  return {{{}}}
""".format(args[1], name, args[1]+", set"+name+", navigation")

    disp_part = """
  const {} = {}C.useContainer()

  return (
    <View>
    </View>
  )
""".format(args[1], name)

    app_part = """
  return (
    <{0}C.Provider>
      <{0}Display />
    </{0}C.Provider>
  )
""".format(name)

    code = """import React, {{{0}}} from "react";
import {{{1}}} from "react-native";
import {{{2}}} from "unstated-next";
import {{{8}}} from "react-navigation";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({{{9}}});

const initialData = {{{3}}}

const use{4}=(initialState=initialData)=>{{{5}}}

export const {4}C = createContainer(use{4})

const {4}Display=()=>{{{6}}}

export default () => {{{7}}}
""".format(" useState, useContext, ", " StyleSheet, View, Dimensions", " createContainer ", "", name, hook_part, disp_part, app_part, " NavigationContext ", "")

    with open(path_w, mode='w') as f:
        f.write(code)

if __name__ == "__main__":
    main()
