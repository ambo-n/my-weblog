---
title: Dataclass in Python
description: Understanding dataclasses
date: 2025-10-24
tags: python, programming
---

A **dataclass** is a special type of class in Python designed to store structured data with less boilerplate code.

They can be created via `@dataclass` decorator before the class definition.

```python
from dataclasses import dataclass

```

> 💡 Q1: How are dataclasses different from normal classes?
>
> A: They automatically generate common methods such as **init**(), **repr**(), and **eq**(), so we don’t have to write them ourselves (though we can still override them if needed).

Let's give some examples.

### 1. _`__init__()`_

```python
# normal class

class BoulderingGym:
    def __init__(self, place, capacity):
        self.place = place
        self.capacity  = capacity
```

::: tip
I learnt that while a class definition can start with or without () at the end, it would make more sense to only use () if the class you are defining is inheriting from another class, e.g. class BoulderingGym(Gym).
:::

With a dataclass

```python
@dataclass
class BoulderingGym:
    place: str
    capacity: int
```

If we try to create an instance without arguments:

```python
> bouldering_gym = BoulderingGym()
```

**Output**

```code
Traceback (most recent call last):
  File "/Users/ambernguyen/Documents/Playground/playground.py", line 8, in <module>
    bouldering_gym = BoulderingGym()
TypeError: BoulderingGym.__init__() missing 2 required
positional arguments: 'place' and 'capacity'
```

Tadaaaa, notice how no `__init__()` was written for `@dataclass`. The dataclass generated it for us.

### 2. _`__repr__()`_

This stands for representation string - how your object looks when printed.

```python
#normal class

class BoulderingGym:
    def __init__(self, place, capacity):
        self.place = place
        self.capacity  = capacity

b_gym = BoulderingGym("Australia", 1000)
print(b_gym)
```

**Output**

```code
<__main__.BoulderingGym object at 0x10250dbe0>
```

If we then add `__repr__()` manually:

```diff-python
#normal class

class BoulderingGym:
    def __init__(self, place, capacity):
        self.place = place
        self.capacity  = capacity

+   def __repr__(self):
+     return ("BoulderingGym(place={}, capacity={})".format(self.place, self.capacity))

b_gym = BoulderingGym("Australia", 1000)
print(b_gym)
```

**Output**

```code
BoulderingGym(place=Australia, capacity=1000)
```

BUT, if we use `@dataclass`

```python
from dataclasses import dataclass

@dataclass
class BoulderingGym:
    place: str
    capacity: int

b_gym = BoulderingGym("Australia", 1000)
print(b_gym)
```

**Output**

```code
BoulderingGym(place='Australia', capacity=1000)
```

Very nice, no need to write `__repr__()` method but it still prints some meaningful information about the object.

### 3. _`__eq__()`_

The`__eq__()` checks equality between two objects.

```python
# normal class
class BoulderingGym:
    def __init__(self, place, capacity):
        self.place = place
        self.capacity  = capacity

    def __repr__(self):
      return ("BoulderingGym(place={}, capacity={})".format(self.place, self.capacity))

b_gym_1 = BoulderingGym("Australia", 1000)
b_gym_2 = BoulderingGym("Australia", 1000)
print(b_gym_1 == b_gym_2)
```

**Output**

```code
False
```

For a dataclass:

```python
from dataclasses import dataclass

@dataclass
class BoulderingGym:
    place: str
    capacity: int

b_gym_1 = BoulderingGym("Australia", 1000)
b_gym_2 = BoulderingGym("Australia", 1000)

print(b_gym_1 == b_gym_2)
```

**Output**

```code
True
```

If we want the normal class to do the same as the dataclass, we need to define `__eq__()` manually to specify what being compared because currently, it is comparing the objects' id and they are different. Let's make some changes:

```diff-python
# normal class
class BoulderingGym:
    def __init__(self, place, capacity):
        self.place = place
        self.capacity  = capacity

    def __repr__(self):
      return ("BoulderingGym(place={}, capacity={})".format(self.place, self.capacity))

+   def __eq__(self, other):
+      if isinstance(other, BoulderingGym):
+         return(self.capacity, self.place) == (other.capacity, other.place)

b_gym_1 = BoulderingGym("Australia", 1000)
b_gym_2 = BoulderingGym("Australia", 1000)
print(b_gym_1 == b_gym_2)
```

**Output**

```code
True
```

### 4. Other dataclass parameters

@dataclasses.dataclass(\*, init=True, repr=True, eq=True, order=False, unsafe_hash=False, frozen=False, match_args=True, kw_only=False, slots=False, weakref_slot=False)

More information about what each parameter does can be found at <a href="https://docs.python.org/3/library/dataclasses.html">dataclasses — Data Classes</a>.

### 5. Setting default values

Say we want to set a default value for `place`:

```diff-python
@dataclass
class BoulderingGym:
-   place: str
    capacity: int
+   place: str = "Australia

b_gym_1 = BoulderingGym(1000)
print(b_gym_1)
```

**Output**

```code
BoulderingGym(capacity=1000, place='Australia')
```

Notice how I shifted `place` to be after `capacity`. This is because _⚠️fields without default values cannot appear after fields with default values_. Just the rule, sorry.

And that's the quick crash course on @dataclass.

### 6. More readings:

- <a href="https://www.dataquest.io/blog/how-to-use-python-data-classes/">How to Use Python Data Classes (A Beginner’s Guide)</a>
- <a href="https://docs.python.org/3/library/dataclasses.html">dataclasses — Data Classes</a>
