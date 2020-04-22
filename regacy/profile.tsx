<Ftext text="自分の投稿" />
      <FlatList
        data={me.myPosts}
        // horizontal={true}
        onRefresh={() => {
          dispatch(asyncGetMyPosts(uid));
        }}
        refreshing={me.isFetching}
        renderItem={item => {
          return (
            <View>
              <Image
                source={{ uri: item.item.uri }}
                style={{ width: 150, height: 150 }}
              />
              <Text>{item.item.postBy}</Text>
            </View>
          );
        }}
      />
      <Tegaki text="自分の回答" />
      <FlatList
        data={me.myPins}
        horizontal={true}
        onRefresh={() => {
          dispatch(asyncGetMyPins(uid));
        }}
        refreshing={me.isFetching}
        renderItem={item => {
          return (
            <View>
              <Image
                source={{ uri: item.item.uri }}
                style={{ width: 50, height: 50 }}
              />
              <Text>{item.item.thms[item.item.order - 1]}</Text>
              <Text>{item.item.body}</Text>
            </View>
          );
        }}
      />
