from factory import Factory

if __name__ == "__main__":
    factory = Factory()
    import openai

    print(openai.VERSION)

    # dataCreator = factory.create_datacreator()
    # dataCreator.publishData(500)
